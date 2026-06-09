from flask import Flask, request, jsonify, send_from_directory
import uuid
from flask_cors import CORS
from crypto import CryptoEngine
import datetime
from supabase import create_client, Client
from supabase_config import SUPABASE_URL as CONFIG_URL, SUPABASE_KEY as CONFIG_KEY
import os
from dotenv import load_dotenv
from functools import wraps
from pathlib import Path
from werkzeug.security import check_password_hash, generate_password_hash

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIST_DIR = BASE_DIR.parent / "frontend" / "dist"

# Load .env.backend first so env vars override supabase_config.py defaults
load_dotenv(dotenv_path=BASE_DIR / '.env.backend')

SUPABASE_URL = os.environ.get('SUPABASE_URL', CONFIG_URL)
SUPABASE_SERVICE_ROLE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
SUPABASE_KEY = SUPABASE_SERVICE_ROLE_KEY or os.environ.get('SUPABASE_KEY', CONFIG_KEY)

app = Flask(__name__, static_folder=str(FRONTEND_DIST_DIR), static_url_path='')
CORS(app)  # Enable CORS for frontend communication
crypto = CryptoEngine()

if not SUPABASE_SERVICE_ROLE_KEY:
    print(
        "Warning: SUPABASE_SERVICE_ROLE_KEY is not set. "
        "Registration requires a Supabase service-role key or matching RLS insert policies.",
        flush=True,
    )

# Initialize Supabase client (uses service role key from .env.backend)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# In-memory session store: token -> username
active_sessions: dict[str, str] = {}

MISSING_SCHEMA_MESSAGE = (
    "Supabase tables are missing. Run database/SUPABASE_NEW_DATABASE_SETUP.sql in the Supabase SQL Editor "
    "for the project configured in .env.backend."
)


def is_missing_schema_error(error: Exception) -> bool:
    error_text = str(error)
    return (
        "PGRST205" in error_text
        or "PGRST204" in error_text
        or "schema cache" in error_text
        or "Could not find the table" in error_text
        or "Could not find the" in error_text
    )


def missing_schema_response():
    return jsonify({"status": "error", "message": MISSING_SCHEMA_MESSAGE}), 500


def create_notification(profile_id, title, message, notification_type="system", transaction_id=None):
    try:
        notification_data = {
            "profile_id": profile_id,
            "title": title,
            "message": message,
            "notification_type": notification_type,
            "transaction_id": transaction_id,
        }
        supabase.table("notifications").insert(notification_data).execute()
    except Exception as e:
        if is_missing_schema_error(e):
            raise
        print(f"Error creating notification: {e}")

def generate_session_token() -> str:
    token = str(uuid.uuid4())
    return token

def require_auth(f):
    """Decorator to require a valid session token."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token or token not in active_sessions:
            return jsonify({"status": "error", "message": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated

# ========================================
# Helper Functions
# ========================================

def get_user_profile(username):
    """Fetch user profile from Supabase profiles table"""
    try:
        response = supabase.table('profiles').select('*').eq('registration_number', username).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
        return None
    except Exception as e:
        if is_missing_schema_error(e):
            raise
        print(f"Error fetching profile: {e}")
        return None

def get_user_account(profile_id):
    """Fetch user's primary account from Supabase accounts table"""
    try:
        response = supabase.table('accounts').select('*').eq('profile_id', profile_id).eq('is_active', True).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
        return None
    except Exception as e:
        if is_missing_schema_error(e):
            raise
        print(f"Error fetching account: {e}")
        return None

def get_receiver_account(receiver_username):
    """Fetch receiver's account"""
    try:
        receiver_profile = get_user_profile(receiver_username)
        if not receiver_profile:
            return None
        return get_user_account(receiver_profile['id'])
    except Exception as e:
        if is_missing_schema_error(e):
            raise
        print(f"Error fetching receiver account: {e}")
        return None

def record_transaction(sender_account_id, receiver_account_id, amount, status, failure_reason=None):
    """Record transaction in Supabase transactions table"""
    try:
        transaction_data = {
            'sender_account_id': sender_account_id,
            'receiver_account_id': receiver_account_id,
            'amount': float(amount),
            'status': status,
            'failure_reason': failure_reason,
            'reference': f"TXN-{datetime.datetime.now().isoformat()}"
        }
        response = supabase.table('transactions').insert(transaction_data).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        if is_missing_schema_error(e):
            raise
        print(f"Error recording transaction: {e}")
        return None

def update_account_balance(account_id, new_balance):
    """Update account balance in Supabase"""
    try:
        supabase.table('accounts').update({'balance': float(new_balance)}).eq('id', account_id).execute()
        return True
    except Exception as e:
        if is_missing_schema_error(e):
            raise
        print(f"Error updating balance: {e}")
        return False

def update_profile_timestamp(profile_id, new_t):
    """Update user's timestamp (T) in Supabase"""
    try:
        supabase.table('profiles').update({'timestamp_t': new_t}).eq('id', profile_id).execute()
        return True
    except Exception as e:
        if is_missing_schema_error(e):
            raise
        print(f"Error updating timestamp: {e}")
        return False

def update_daily_spend(profile_id, today_spent):
    """Update user's daily spending tracker."""
    try:
        supabase.table('profiles').update({'today_spent': float(today_spent)}).eq('id', profile_id).execute()
        return True
    except Exception as e:
        if is_missing_schema_error(e):
            raise
        print(f"Error updating daily spend: {e}")
        return False

# ========================================
# API Endpoints
# ========================================

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok", "message": "E-Banking API is running"}), 200

@app.route('/')
def serve_index():
    return app.send_static_file('index.html')

@app.route('/login', methods=['POST'])
def login():
    """Authenticate user by username and password"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"status": "error", "message": "Missing username or password"}), 400

        # Fetch profile
        user_profile = get_user_profile(username)
        if not user_profile:
            return jsonify({"status": "error", "message": "User not found"}), 404

        password_hash = user_profile.get('password_hash')
        if password_hash:
            password_valid = check_password_hash(password_hash, password)
        else:
            password_valid = user_profile.get('password_key_k2') == password

        if not password_valid:
            return jsonify({"status": "error", "message": "Invalid password"}), 401

        # Fetch account
        user_account = get_user_account(user_profile['id'])
        if not user_account:
            return jsonify({"status": "error", "message": "Account not found"}), 404

        token = generate_session_token()
        active_sessions[token] = username
        create_notification(user_profile['id'], "Login successful", "Your account was accessed with K2 authentication.", "login")

        return jsonify({
            "status": "success",
            "token": token,
            "user": {
                "id": user_profile['id'],
                "username": user_profile['registration_number'],
                "k1": user_profile['hmac_key_k1'],
                "k2": user_profile['password_key_k2'],
                "bp": user_profile.get('fingerprint_bp') or '123456',
                "t": user_profile['timestamp_t'],
                "balance": float(user_account['balance']),
                "accountId": user_account['id'],
                "daily_limit": float(user_profile.get('daily_limit', 5000)),
                "today_spent": float(user_profile.get('today_spent', 0)),
            }
        }), 200

    except Exception as e:
        if is_missing_schema_error(e):
            print(f"Login schema error: {e}")
            return missing_schema_response()
        print(f"Login error: {e}")
        return jsonify({"status": "error", "message": "Internal server error"}), 500


@app.route('/transfer', methods=['POST'])
@require_auth
def process_transfer():
    """
    Process secure money transfer with cryptographic verification

    Request:
    {
        "username": "sohan",
        "payload": "base64_ciphertext",
        "iv": "base64_initialization_vector"
    }
    """
    try:
        data = request.get_json()
        username = data.get('username')
        encrypted_payload = data.get('payload')
        iv = data.get('iv')

        if not username or not encrypted_payload or not iv:
            return jsonify({"status": "error", "message": "Missing username, payload, or iv"}), 400

        # 1. Fetch user from Supabase
        user_profile = get_user_profile(username)
        if not user_profile:
            return jsonify({"status": "error", "message": "User not found"}), 404

        user_account = get_user_account(user_profile['id'])
        if not user_account:
            return jsonify({"status": "error", "message": "User account not found"}), 404

        # 2. Decryption (K2, BP, T)
        decrypted_data = crypto.decrypt_data(
            encrypted_payload,
            iv,
            user_profile['password_key_k2'],
            user_profile.get('fingerprint_bp') or '123456',
            user_profile['timestamp_t']
        )

        if not decrypted_data:
            return jsonify({"status": "error", "message": "Decryption failed or invalid Timestamp"}), 401

        message_m = decrypted_data['M']  # "Receiver:Bob|Amt:1000"
        f1_from_user = decrypted_data['F1']

        # 3. Integrity check (HMAC verification)
        f2_generated = crypto.generate_hmac(user_profile['hmac_key_k1'], message_m)

        if f1_from_user != f2_generated:
            txn = record_transaction(user_account['id'], None, 0, 'aborted', 'HMAC mismatch')
            create_notification(user_profile['id'], "Transfer aborted", "Message integrity check failed before transfer.", "transfer_aborted", txn.get('id') if txn else None)
            return jsonify({"status": "error", "message": "Data integrity compromised (HMAC mismatch)"}), 403

        # 4. Data extraction
        try:
            parts = message_m.split('|')
            receiver_username = parts[0].split(':')[1]
            amount = float(parts[1].split(':')[1])
        except Exception:
            return jsonify({"status": "error", "message": "Invalid message format"}), 400

        # 5. Find receiver
        receiver_account = get_receiver_account(receiver_username)
        if not receiver_account:
            txn = record_transaction(user_account['id'], None, amount, 'aborted', 'Receiver not found')
            create_notification(user_profile['id'], "Transfer aborted", "Receiver username was not found in the bank database.", "transfer_aborted", txn.get('id') if txn else None)
            return jsonify({"status": "error", "message": "Receiver not found"}), 404

        # 6. Balance check
        if user_account['balance'] < amount:
            txn = record_transaction(user_account['id'], receiver_account['id'], amount, 'futile', 'Insufficient balance')
            create_notification(user_profile['id'], "Transfer futile", "Insufficient balance for the requested amount.", "transfer_futile", txn.get('id') if txn else None)
            return jsonify({"status": "futile", "message": "Insufficient balance"}), 400

        # 7. Execute transfer
        sender_new_balance = float(user_account['balance']) - amount
        receiver_new_balance = float(receiver_account['balance']) + amount

        update_account_balance(user_account['id'], sender_new_balance)
        update_account_balance(receiver_account['id'], receiver_new_balance)

        # Update timestamp
        new_t = datetime.datetime.now(datetime.timezone.utc).isoformat()
        update_profile_timestamp(user_profile['id'], new_t)
        update_daily_spend(user_profile['id'], float(user_profile.get('today_spent', 0)) + amount)

        # Record transaction
        txn = record_transaction(user_account['id'], receiver_account['id'], amount, 'success')
        transaction_id = txn.get('id') if txn else None
        create_notification(user_profile['id'], "Transfer successful", f"BDT {amount:.2f} sent to {receiver_username}.", "transfer_success", transaction_id)
        create_notification(receiver_account['profile_id'], "Money received", f"BDT {amount:.2f} received from {username}.", "transfer_success", transaction_id)

        return jsonify({
            "status": "success",
            "message": f"Transfer of {amount} to {receiver_username} successful",
            "new_t": new_t,
            "new_balance": sender_new_balance
        }), 200

    except Exception as e:
        if is_missing_schema_error(e):
            print(f"Transfer schema error: {e}")
            return missing_schema_response()
        print(f"Transfer error: {e}")
        return jsonify({"status": "error", "message": "Internal server error"}), 500

@app.route('/user/<username>', methods=['GET'])
@require_auth
def get_user(username):
    """Get user profile and account information"""
    try:
        user_profile = get_user_profile(username)
        if not user_profile:
            return jsonify({"status": "error", "message": "User not found"}), 404

        user_account = get_user_account(user_profile['id'])
        if not user_account:
            return jsonify({"status": "error", "message": "Account not found"}), 404

        return jsonify({
            "status": "success",
            "user": {
                "id": user_profile['id'],
                "username": user_profile['registration_number'],
                "balance": float(user_account['balance']),
                "daily_limit": float(user_profile['daily_limit']),
                "today_spent": float(user_profile['today_spent']),
            }
        }), 200
    except Exception as e:
        if is_missing_schema_error(e):
            print(f"Get user schema error: {e}")
            return missing_schema_response()
        print(f"Error: {e}")
        return jsonify({"status": "error", "message": "Internal server error"}), 500

@app.route('/transactions/<username>', methods=['GET'])
@require_auth
def get_transactions(username):
    """Get user's transaction history (both sent and received)"""
    try:
        user_profile = get_user_profile(username)
        if not user_profile:
            return jsonify({"status": "error", "message": "User not found"}), 404

        user_account = get_user_account(user_profile['id'])
        if not user_account:
            return jsonify({"status": "error", "message": "Account not found"}), 404

        # Fetch both sent AND received transactions
        sent_response = supabase.table('transactions').select('*').eq('sender_account_id', user_account['id']).order('created_at', desc=True).limit(20).execute()
        
        # Get receiver's profile ID to fetch received transactions
        received_response = supabase.table('transactions').select('*').eq('receiver_account_id', user_account['id']).order('created_at', desc=True).limit(20).execute()

        transactions = []
        
        # Process sent transactions
        if sent_response.data:
            for txn in sent_response.data:
                # Get receiver name
                receiver_account = supabase.table('accounts').select('profile_id').eq('id', txn['receiver_account_id']).execute()
                receiver_name = 'Unknown'
                if receiver_account.data:
                    receiver_profile = supabase.table('profiles').select('registration_number').eq('id', receiver_account.data[0]['profile_id']).execute()
                    if receiver_profile.data:
                        receiver_name = receiver_profile.data[0]['registration_number']
                
                transactions.append({
                    "id": txn['id'],
                    "amount": float(txn['amount']),
                    "status": txn['status'],
                    "created_at": txn['created_at'],
                    "reference": txn['reference'],
                    "receiver_username": receiver_name,
                    "type": "sent"
                })
        
        # Process received transactions
        if received_response.data:
            for txn in received_response.data:
                # Get sender name
                sender_account = supabase.table('accounts').select('profile_id').eq('id', txn['sender_account_id']).execute()
                sender_name = 'Unknown'
                if sender_account.data:
                    sender_profile = supabase.table('profiles').select('registration_number').eq('id', sender_account.data[0]['profile_id']).execute()
                    if sender_profile.data:
                        sender_name = sender_profile.data[0]['registration_number']
                
                transactions.append({
                    "id": txn['id'],
                    "amount": float(txn['amount']),
                    "status": txn['status'],
                    "created_at": txn['created_at'],
                    "reference": txn['reference'],
                    "sender_username": sender_name,
                    "type": "received"
                })
        
        # Sort all transactions by date (most recent first)
        transactions.sort(key=lambda x: x['created_at'], reverse=True)

        return jsonify({
            "status": "success",
            "transactions": transactions
        }), 200
    except Exception as e:
        if is_missing_schema_error(e):
            print(f"Transactions schema error: {e}")
            return missing_schema_response()
        print(f"Error: {e}")
        return jsonify({"status": "error", "message": "Internal server error"}), 500

@app.route('/notifications/<username>', methods=['GET'])
@require_auth
def get_notifications(username):
    """Get recent notification messages for a user."""
    try:
        user_profile = get_user_profile(username)
        if not user_profile:
            return jsonify({"status": "error", "message": "User not found"}), 404

        response = (
            supabase.table('notifications')
            .select('*')
            .eq('profile_id', user_profile['id'])
            .order('created_at', desc=True)
            .limit(30)
            .execute()
        )

        return jsonify({
            "status": "success",
            "notifications": response.data or []
        }), 200
    except Exception as e:
        if is_missing_schema_error(e):
            print(f"Notifications schema error: {e}")
            return missing_schema_response()
        print(f"Notifications error: {e}")
        return jsonify({"status": "error", "message": "Internal server error"}), 500

@app.route('/register', methods=['POST'])
def register():
    """Register a new user account"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        nid = data.get('nid') or data.get('brc') or ''
        activation_code = data.get('activationCode') or data.get('activation_code') or ''

        if not username or not password or not nid or not activation_code:
            return jsonify({"status": "error", "message": "Missing username, password, NID/BRC, or activation code"}), 400

        # Check if user already exists
        existing_profile = get_user_profile(username)
        if existing_profile:
            return jsonify({"status": "error", "message": "Username already exists"}), 400

        # Step 1: Create Supabase Auth user first.
        # profiles.id is a FK to auth.users.id, so we need a valid auth UUID.
        # A synthetic email is used since this app uses username-based auth.
        synthetic_email = f"{username}@example.com"
        try:
            auth_response = supabase.auth.admin.create_user({
                "email": synthetic_email,
                "password": password,
                "email_confirm": True,          # skip email verification step
                "user_metadata": {"username": username}
            })
            auth_user_id = auth_response.user.id
        except Exception as auth_err:
            print(f"Auth user creation error: {auth_err}")
            if "User not allowed" in str(auth_err):
                return jsonify({
                    "status": "error",
                    "message": (
                        "Backend Supabase key cannot create Auth users. "
                        "Set SUPABASE_SERVICE_ROLE_KEY in .env.backend."
                    )
                }), 500
            return jsonify({"status": "error", "message": f"Auth error: {str(auth_err)}"}), 500

        # Step 2: Insert profile using the auth user's UUID (satisfies FK constraint)
        bp = data.get('bp') or '123456'
        k1 = crypto.generate_hmac(activation_code, f"{nid}|{username}|{bp}")
        k2 = crypto.stretch_password(password, nid)
        t = datetime.datetime.now(datetime.timezone.utc).isoformat()

        profile_data = {
            'id': auth_user_id,          # must match auth.users.id (FK)
            'registration_number': username,
            'password_hash': generate_password_hash(password),
            'password_key_k2': k2,
            'fingerprint_bp': bp,
            'hmac_key_k1': k1,
            'nid_brc_hash': crypto.generate_hmac(activation_code, nid),
            'activation_code_hash': crypto.generate_hmac(nid, activation_code),
            'timestamp_t': t,
            'daily_limit': 5000.0,
            'today_spent': 0.0
        }

        response = supabase.table('profiles').insert(profile_data).execute()
        if not response.data:
            # Clean up orphaned auth user if profile insert failed
            try:
                supabase.auth.admin.delete_user(auth_user_id)
            except Exception:
                pass
            return jsonify({"status": "error", "message": "Failed to create profile"}), 500

        profile_id = response.data[0]['id']

        # Step 3: Create linked bank account
        account_data = {
            'profile_id': profile_id,
            'balance': 5000.0,
            'is_active': True,
            'account_number': f"ACC-{username}"
        }
        supabase.table('accounts').insert(account_data).execute()
        create_notification(profile_id, "Account activated", "Your E-Payment account is ready for petty cash transactions.", "registration")

        return jsonify({"status": "success", "message": "Account created successfully"}), 201

    except Exception as e:
        if is_missing_schema_error(e):
            print(f"Registration schema error: {e}")
            return missing_schema_response()
        print(f"Registration error: {e}")
        return jsonify({"status": "error", "message": f"Database error: {str(e)}"}), 500

@app.route('/check-receiver/<username>', methods=['GET'])
@require_auth
def check_receiver(username):
    """Check if a receiver username exists"""
    try:
        profile = get_user_profile(username)
        if not profile:
            return jsonify({"status": "error", "message": "Receiver not found"}), 404
        return jsonify({"status": "success", "username": profile['registration_number']}), 200
    except Exception as e:
        if is_missing_schema_error(e):
            print(f"Check receiver schema error: {e}")
            return missing_schema_response()
        print(f"Check receiver error: {e}")
        return jsonify({"status": "error", "message": "Internal server error"}), 500

# ========================================
# Catch-all route for React Router - MUST be after all API routes
# ========================================
@app.route('/<path:path>')
def serve_static(path):
    """Serve static files or index.html for SPA routing"""
    dist_dir = os.path.abspath(app.static_folder)
    requested_path = os.path.realpath(os.path.join(dist_dir, path))
    if requested_path.startswith(dist_dir) and os.path.isfile(requested_path):
        return send_from_directory(dist_dir, os.path.relpath(requested_path, dist_dir))
    return app.send_static_file('index.html')

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors by serving index.html for SPA routing"""
    return app.send_static_file('index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', '5001'))
    app.run(debug=True, port=port)
