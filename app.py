from flask import Flask, request, jsonify
import uuid
from flask_cors import CORS
from crypto import CryptoEngine
import datetime
from supabase import create_client, Client
from supabase_config import SUPABASE_URL as CONFIG_URL, SUPABASE_KEY as CONFIG_KEY
import os
from dotenv import load_dotenv

# Load .env.backend first so env vars override supabase_config.py defaults
load_dotenv(dotenv_path='.env.backend')

SUPABASE_URL = os.environ.get('SUPABASE_URL', CONFIG_URL)
SUPABASE_KEY = os.environ.get('SUPABASE_KEY', CONFIG_KEY)

app = Flask(__name__, static_folder='dist', static_url_path='')
CORS(app)  # Enable CORS for frontend communication
crypto = CryptoEngine()

# Initialize Supabase client (uses service role key from .env.backend)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

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
        print(f"Error recording transaction: {e}")
        return None

def update_account_balance(account_id, new_balance):
    """Update account balance in Supabase"""
    try:
        supabase.table('accounts').update({'balance': float(new_balance)}).eq('id', account_id).execute()
        return True
    except Exception as e:
        print(f"Error updating balance: {e}")
        return False

def update_profile_timestamp(profile_id, new_t):
    """Update user's timestamp (T) in Supabase"""
    try:
        supabase.table('profiles').update({'timestamp_t': new_t}).eq('id', profile_id).execute()
        return True
    except Exception as e:
        print(f"Error updating timestamp: {e}")
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

        # Validate password (stored as K2 = password)
        if user_profile.get('password_key_k2') != password:
            return jsonify({"status": "error", "message": "Invalid password"}), 401

        # Fetch account
        user_account = get_user_account(user_profile['id'])
        if not user_account:
            return jsonify({"status": "error", "message": "Account not found"}), 404

        return jsonify({
            "status": "success",
            "user": {
                "id": user_profile['id'],
                "username": user_profile['registration_number'],
                "k1": user_profile['hmac_key_k1'],
                "k2": user_profile['password_key_k2'],
                "bp": user_profile['fingerprint_bp'],
                "t": user_profile['timestamp_t'],
                "balance": float(user_account['balance']),
                "accountId": user_account['id'],
                "daily_limit": float(user_profile.get('daily_limit', 5000)),
                "today_spent": float(user_profile.get('today_spent', 0)),
            }
        }), 200

    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({"status": "error", "message": "Internal server error"}), 500


@app.route('/transfer', methods=['POST'])
def process_transfer():
    """
    Process secure money transfer with cryptographic verification

    Request:
    {
        "username": "sohan",
        "payload": "base64_encrypted_data"
    }
    """
    try:
        data = request.get_json()
        username = data.get('username')
        encrypted_payload = data.get('payload')

        if not username or not encrypted_payload:
            return jsonify({"status": "error", "message": "Missing username or payload"}), 400

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
            user_profile['password_key_k2'],
            user_profile['fingerprint_bp'],
            user_profile['timestamp_t']
        )

        if not decrypted_data:
            return jsonify({"status": "error", "message": "Decryption failed or invalid Timestamp"}), 401

        message_m = decrypted_data['M']  # "Receiver:Bob|Amt:1000"
        f1_from_user = decrypted_data['F1']

        # 3. Integrity check (HMAC verification)
        f2_generated = crypto.generate_hmac(user_profile['hmac_key_k1'], message_m)

        if f1_from_user != f2_generated:
            record_transaction(user_account['id'], None, 0, 'aborted', 'HMAC mismatch')
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
            record_transaction(user_account['id'], None, amount, 'aborted', 'Receiver not found')
            return jsonify({"status": "error", "message": "Receiver not found"}), 404

        # 6. Balance check
        if user_account['balance'] < amount:
            record_transaction(user_account['id'], receiver_account['id'], amount, 'aborted', 'Insufficient balance')
            return jsonify({"status": "futile", "message": "Insufficient balance"}), 400

        # 7. Execute transfer
        sender_new_balance = float(user_account['balance']) - amount
        receiver_new_balance = float(receiver_account['balance']) + amount

        update_account_balance(user_account['id'], sender_new_balance)
        update_account_balance(receiver_account['id'], receiver_new_balance)

        # Update timestamp
        new_t = datetime.datetime.now(datetime.timezone.utc).isoformat()
        update_profile_timestamp(user_profile['id'], new_t)

        # Record transaction
        record_transaction(user_account['id'], receiver_account['id'], amount, 'success')

        return jsonify({
            "status": "success",
            "message": f"Transfer of {amount} to {receiver_username} successful",
            "new_t": new_t,
            "new_balance": sender_new_balance
        }), 200

    except Exception as e:
        print(f"Transfer error: {e}")
        return jsonify({"status": "error", "message": "Internal server error"}), 500

@app.route('/user/<username>', methods=['GET'])
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
        print(f"Error: {e}")
        return jsonify({"status": "error", "message": "Internal server error"}), 500

@app.route('/transactions/<username>', methods=['GET'])
def get_transactions(username):
    """Get user's transaction history"""
    try:
        user_profile = get_user_profile(username)
        if not user_profile:
            return jsonify({"status": "error", "message": "User not found"}), 404

        user_account = get_user_account(user_profile['id'])
        if not user_account:
            return jsonify({"status": "error", "message": "Account not found"}), 404

        # Fetch transactions
        response = supabase.table('transactions').select('*').eq('sender_account_id', user_account['id']).order('created_at', desc=True).limit(20).execute()

        transactions = []
        if response.data:
            for txn in response.data:
                transactions.append({
                    "id": txn['id'],
                    "amount": float(txn['amount']),
                    "status": txn['status'],
                    "created_at": txn['created_at'],
                    "reference": txn['reference']
                })

        return jsonify({
            "status": "success",
            "transactions": transactions
        }), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"status": "error", "message": "Internal server error"}), 500

@app.route('/register', methods=['POST'])
def register():
    """Register a new user account"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"status": "error", "message": "Missing username or password"}), 400

        # Check if user already exists
        existing_profile = get_user_profile(username)
        if existing_profile:
            return jsonify({"status": "error", "message": "Username already exists"}), 400

        # Step 1: Create Supabase Auth user first.
        # profiles.id is a FK to auth.users.id, so we need a valid auth UUID.
        # A synthetic email is used since this app uses username-based auth.
        synthetic_email = f"{username}@ebanking.internal"
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
            return jsonify({"status": "error", "message": f"Auth error: {str(auth_err)}"}), 500

        # Step 2: Insert profile using the auth user's UUID (satisfies FK constraint)
        bp = '123456'
        k1 = crypto.generate_hmac(username, "secret_key_generation")
        t = datetime.datetime.now(datetime.timezone.utc).isoformat()

        profile_data = {
            'id': auth_user_id,          # must match auth.users.id (FK)
            'registration_number': username,
            'password_key_k2': password,
            'fingerprint_bp': bp,
            'hmac_key_k1': k1,
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

        return jsonify({"status": "success", "message": "Account created successfully"}), 201

    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({"status": "error", "message": f"Database error: {str(e)}"}), 500

@app.route('/check-receiver/<username>', methods=['GET'])
def check_receiver(username):
    """Check if a receiver username exists"""
    try:
        profile = get_user_profile(username)
        if not profile:
            return jsonify({"status": "error", "message": "Receiver not found"}), 404
        return jsonify({"status": "success", "username": profile['registration_number']}), 200
    except Exception as e:
        print(f"Check receiver error: {e}")
        return jsonify({"status": "error", "message": "Internal server error"}), 500

# ========================================
# Catch-all route for React Router - MUST be after all API routes
# ========================================
@app.route('/<path:path>')
def serve_static(path):
    """Serve static files or index.html for SPA routing"""
    dist_dir = os.path.abspath(app.static_folder)
    requested_path = os.path.join(dist_dir, path)
    if os.path.exists(requested_path) and os.path.isfile(requested_path):
        return app.send_static_file(path)
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
