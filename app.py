<<<<<<< HEAD
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

# Load .env.backend first so env vars override supabase_config.py defaults
=======
from fastapi import FastAPI, Request, Header, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
import uuid
import datetime
import os
from dotenv import load_dotenv
from typing import Optional, Dict
from pydantic import BaseModel
import psycopg2
from contextlib import asynccontextmanager

from crypto import CryptoEngine
from supabase import create_client, Client
from supabase_config import SUPABASE_URL as CONFIG_URL, SUPABASE_KEY as CONFIG_KEY

# Load .env.backend first
>>>>>>> origin/updated
load_dotenv(dotenv_path='.env.backend')

SUPABASE_URL = os.environ.get('SUPABASE_URL', CONFIG_URL)
SUPABASE_KEY = os.environ.get('SUPABASE_KEY', CONFIG_KEY)
<<<<<<< HEAD

app = Flask(__name__, static_folder='dist', static_url_path='')
CORS(app)  # Enable CORS for frontend communication
crypto = CryptoEngine()

# Initialize Supabase client (uses service role key from .env.backend)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# In-memory session store: token -> username
active_sessions: dict[str, str] = {}

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
=======
SUPABASE_DB_PASSWORD = os.environ.get('SUPABASE_DB_PASSWORD')

# Database connection details
PROJECT_ID = SUPABASE_URL.split('//')[1].split('.')[0]
DB_HOST = f"db.{PROJECT_ID}.supabase.co"
DB_NAME = "postgres"
DB_USER = "postgres"
DB_PORT = "5432"

def init_db():
    """Initialize database tables using psycopg2"""
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=SUPABASE_DB_PASSWORD,
            port=DB_PORT
        )
        cur = conn.cursor()
        
        # Create profiles table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS profiles (
                id UUID PRIMARY KEY,
                registration_number TEXT UNIQUE NOT NULL,
                password_key_k2 TEXT NOT NULL,
                fingerprint_bp TEXT NOT NULL,
                hmac_key_k1 TEXT NOT NULL,
                last_t BIGINT DEFAULT 0,
                daily_limit FLOAT DEFAULT 5000.0,
                today_spent FLOAT DEFAULT 0.0,
                last_spent_reset_date DATE DEFAULT CURRENT_DATE,
                nid TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)

        # Migration: Check if timestamp_t exists and rename to last_t
        cur.execute("""
            DO $$ 
            BEGIN 
                IF EXISTS (SELECT 1 FROM information_schema.columns 
                           WHERE table_name='profiles' AND column_name='timestamp_t') THEN
                    ALTER TABLE profiles RENAME COLUMN timestamp_t TO last_t;
                    ALTER TABLE profiles ALTER COLUMN last_t TYPE BIGINT USING (
                        CASE 
                            WHEN last_t ~ '^[0-9]+$' THEN last_t::BIGINT 
                            ELSE 0 
                        END
                    );
                END IF;
                
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                               WHERE table_name='profiles' AND column_name='last_spent_reset_date') THEN
                    ALTER TABLE profiles ADD COLUMN last_spent_reset_date DATE DEFAULT CURRENT_DATE;
                END IF;

                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                               WHERE table_name='profiles' AND column_name='nid') THEN
                    ALTER TABLE profiles ADD COLUMN nid TEXT;
                END IF;
            END $$;
        """)

        # Register Atomic Stored Procedure
        cur.execute("""
            CREATE OR REPLACE FUNCTION process_transfer_secure(
                p_sender_username TEXT,
                p_receiver_username TEXT,
                p_amount DOUBLE PRECISION,
                p_timestamp BIGINT,
                p_reference TEXT
            ) RETURNS JSON AS $$
            DECLARE
                v_sender_profile RECORD;
                v_receiver_profile RECORD;
                v_sender_account RECORD;
                v_receiver_account RECORD;
                v_today DATE;
                v_current_spent DOUBLE PRECISION;
            BEGIN
                -- 1. Fetch profiles with locking
                SELECT * INTO v_sender_profile FROM profiles WHERE registration_number = p_sender_username FOR UPDATE;
                IF NOT FOUND THEN
                    RETURN json_build_object('status', 'error', 'message', 'Sender profile not found');
                END IF;

                SELECT * INTO v_receiver_profile FROM profiles WHERE registration_number = p_receiver_username FOR UPDATE;
                IF NOT FOUND THEN
                    RETURN json_build_object('status', 'error', 'message', 'Receiver profile not found');
                END IF;

                -- 2. Fetch accounts with locking
                SELECT * INTO v_sender_account FROM accounts WHERE profile_id = v_sender_profile.id AND is_active = TRUE FOR UPDATE;
                IF NOT FOUND THEN
                    RETURN json_build_object('status', 'error', 'message', 'Sender account not found');
                END IF;

                SELECT * INTO v_receiver_account FROM accounts WHERE profile_id = v_receiver_profile.id AND is_active = TRUE FOR UPDATE;
                IF NOT FOUND THEN
                    RETURN json_build_object('status', 'error', 'message', 'Receiver account not found');
                END IF;

                -- 3. Balance verification
                IF v_sender_account.balance < p_amount THEN
                    INSERT INTO transactions (sender_account_id, receiver_account_id, amount, status, failure_reason, reference)
                    VALUES (v_sender_account.id, v_receiver_account.id, p_amount, 'aborted', 'Insufficient balance', p_reference);
                    RETURN json_build_object('status', 'futile', 'message', 'Insufficient balance');
                END IF;

                -- 4. Daily Limit validation & Reset check
                v_today := CURRENT_DATE;
                IF v_sender_profile.last_spent_reset_date IS NULL OR v_sender_profile.last_spent_reset_date < v_today THEN
                    v_current_spent := 0.0;
                    UPDATE profiles SET today_spent = 0.0, last_spent_reset_date = v_today WHERE id = v_sender_profile.id;
                ELSE
                    v_current_spent := v_sender_profile.today_spent;
                END IF;

                IF v_current_spent + p_amount > v_sender_profile.daily_limit THEN
                    INSERT INTO transactions (sender_account_id, receiver_account_id, amount, status, failure_reason, reference)
                    VALUES (v_sender_account.id, v_receiver_account.id, p_amount, 'aborted', 'Daily limit exceeded', p_reference);
                    RETURN json_build_object('status', 'error', 'message', 'Daily limit exceeded');
                END IF;

                -- 5. Replay protection (DB level check)
                IF p_timestamp <= v_sender_profile.last_t THEN
                    INSERT INTO transactions (sender_account_id, receiver_account_id, amount, status, failure_reason, reference)
                    VALUES (v_sender_account.id, v_receiver_account.id, p_amount, 'aborted', 'Replay attack detected (T <= Last_T)', p_reference);
                    RETURN json_build_object('status', 'error', 'message', 'Replay attack detected');
                END IF;

                -- 6. Apply balances
                UPDATE accounts SET balance = balance - p_amount WHERE id = v_sender_account.id;
                UPDATE accounts SET balance = balance + p_amount WHERE id = v_receiver_account.id;

                -- 7. Update profile
                UPDATE profiles SET 
                    last_t = p_timestamp, 
                    today_spent = v_current_spent + p_amount,
                    last_spent_reset_date = v_today
                WHERE id = v_sender_profile.id;

                -- 8. Insert success log
                INSERT INTO transactions (sender_account_id, receiver_account_id, amount, status, reference)
                VALUES (v_sender_account.id, v_receiver_account.id, p_amount, 'success', p_reference);

                RETURN json_build_object(
                    'status', 'success',
                    'message', 'Transfer successful',
                    'new_balance', v_sender_account.balance - p_amount,
                    'new_t', p_timestamp
                );
            END;
            $$ LANGUAGE plpgsql;
        """)

        
        # Create accounts table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS accounts (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                profile_id UUID REFERENCES profiles(id),
                balance FLOAT DEFAULT 0.0,
                is_active BOOLEAN DEFAULT TRUE,
                account_number TEXT UNIQUE NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Create transactions table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS transactions (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                sender_account_id UUID REFERENCES accounts(id),
                receiver_account_id UUID REFERENCES accounts(id),
                amount FLOAT NOT NULL,
                status TEXT NOT NULL,
                failure_reason TEXT,
                reference TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        conn.commit()
        cur.close()
        conn.close()
        print("Database tables initialized successfully")
    except Exception as e:
        print(f"Error initializing database: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB
    init_db()
    yield

app = FastAPI(lifespan=lifespan)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

crypto = CryptoEngine()
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# In-memory session store: token -> username
active_sessions: Dict[str, str] = {}

def generate_session_token() -> str:
    return str(uuid.uuid4())

# Models
class LoginRequest(BaseModel):
    username: str
    password: str

class TransferRequest(BaseModel):
    username: str
    payload: str
    iv: str
    T: int

class RegisterRequest(BaseModel):
    username: str
    password: str
    nid: str
    activationCode: str
    macAddress: str
    bp_hash: str

# Dependency for Auth
async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.replace("Bearer ", "")
    if token not in active_sessions:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return active_sessions[token]
>>>>>>> origin/updated

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
<<<<<<< HEAD
        supabase.table('profiles').update({'timestamp_t': new_t}).eq('id', profile_id).execute()
=======
        supabase.table('profiles').update({'last_t': new_t}).eq('id', profile_id).execute()
>>>>>>> origin/updated
        return True
    except Exception as e:
        print(f"Error updating timestamp: {e}")
        return False

# ========================================
# API Endpoints
# ========================================

<<<<<<< HEAD
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
=======
@app.get('/health')
async def health():
    """Health check endpoint"""
    return {"status": "ok", "message": "E-Banking API is running"}

@app.post('/login')
async def login(data: LoginRequest):
    """Authenticate user with PBKDF2 stretching and legacy migration"""
    try:
        username = data.username
        password = data.password

        if not username or not password:
            return JSONResponse(status_code=400, content={"status": "error", "message": "Missing username or password"})
>>>>>>> origin/updated

        # Fetch profile
        user_profile = get_user_profile(username)
        if not user_profile:
<<<<<<< HEAD
            return jsonify({"status": "error", "message": "User not found"}), 404

        # Validate password (stored as K2 = password)
        if user_profile.get('password_key_k2') != password:
            return jsonify({"status": "error", "message": "Invalid password"}), 401
=======
            return JSONResponse(status_code=404, content={"status": "error", "message": "User not found"})

        stored_k2 = user_profile.get('password_key_k2')
        nid = user_profile.get('nid')
        
        authenticated = False
        migrated = False

        # 1. Attempt PBKDF2 verification if NID is available
        if nid:
            stretched_password = crypto.stretch_password(password, nid)
            if stretched_password == stored_k2:
                authenticated = True

        # 2. Fallback to plaintext comparison (Legacy User Migration)
        if not authenticated:
            if stored_k2 == password:
                authenticated = True
                # If we have an NID, we can migrate them now
                if nid:
                    new_k2 = crypto.stretch_password(password, nid)
                    supabase.table('profiles').update({'password_key_k2': new_k2}).eq('id', user_profile['id']).execute()
                    migrated = True
                    print(f"User {username} migrated to stretched password during login.")

        if not authenticated:
            return JSONResponse(status_code=401, content={"status": "error", "message": "Invalid password"})
>>>>>>> origin/updated

        # Fetch account
        user_account = get_user_account(user_profile['id'])
        if not user_account:
<<<<<<< HEAD
            return jsonify({"status": "error", "message": "Account not found"}), 404
=======
            return JSONResponse(status_code=404, content={"status": "error", "message": "Account not found"})
>>>>>>> origin/updated

        token = generate_session_token()
        active_sessions[token] = username

<<<<<<< HEAD
        return jsonify({
            "status": "success",
            "token": token,
=======
        return {
            "status": "success",
            "token": token,
            "migrated": migrated,
>>>>>>> origin/updated
            "user": {
                "id": user_profile['id'],
                "username": user_profile['registration_number'],
                "k1": user_profile['hmac_key_k1'],
<<<<<<< HEAD
                "k2": user_profile['password_key_k2'],
                "bp": user_profile['fingerprint_bp'],
                "t": user_profile['timestamp_t'],
=======
                "k2": stored_k2 if not migrated else new_k2,
                "bp": user_profile['fingerprint_bp'],
                "last_t": user_profile['last_t'],
>>>>>>> origin/updated
                "balance": float(user_account['balance']),
                "accountId": user_account['id'],
                "daily_limit": float(user_profile.get('daily_limit', 5000)),
                "today_spent": float(user_profile.get('today_spent', 0)),
<<<<<<< HEAD
            }
        }), 200

    except Exception as e:
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
        "payload": "base64_encrypted_data"
    }
    """
    try:
        data = request.get_json()
        username = data.get('username')
        encrypted_payload = data.get('payload')

        if not username or not encrypted_payload:
            return jsonify({"status": "error", "message": "Missing username or payload"}), 400
=======
                "last_spent_reset_date": str(user_profile.get('last_spent_reset_date')) if user_profile.get('last_spent_reset_date') else None,
            }
        }

    except Exception as e:
        print(f"Login error: {e}")
        return JSONResponse(status_code=500, content={"status": "error", "message": "Internal server error"})


@app.post('/transfer')
async def process_transfer(data: TransferRequest, username_from_token: str = Depends(get_current_user)):
    """Process secure money transfer with cryptographic verification"""
    try:
        username = data.username
        encrypted_payload = data.payload
        iv_base64 = data.iv
        t_from_client = data.T

        if not all([username, encrypted_payload, iv_base64, t_from_client]):
            return JSONResponse(status_code=400, content={"status": "error", "message": "Missing required transfer fields"})
        
        # Verify that the username in request matches the authenticated user
        if username != username_from_token:
             return JSONResponse(status_code=403, content={"status": "error", "message": "Unauthorized username"})
>>>>>>> origin/updated

        # 1. Fetch user from Supabase
        user_profile = get_user_profile(username)
        if not user_profile:
<<<<<<< HEAD
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
=======
            return JSONResponse(status_code=404, content={"status": "error", "message": "User not found"})

        user_account = get_user_account(user_profile['id'])
        if not user_account:
            return JSONResponse(status_code=404, content={"status": "error", "message": "User account not found"})

        # 2. Decryption (K2, BP, T from client)
        # We use T from client for decryption key derivation as per specification
        decrypted_data = crypto.decrypt_data(
            encrypted_payload,
            iv_base64,
            user_profile['password_key_k2'],
            user_profile['fingerprint_bp'],
            t_from_client
        )

        if not decrypted_data:
            return JSONResponse(status_code=401, content={"status": "error", "message": "Decryption failed or invalid key parameters"})

        message_m = decrypted_data['M']  # "Receiver:Bob|Amt:1000|T:12345"
>>>>>>> origin/updated
        f1_from_user = decrypted_data['F1']

        # 3. Integrity check (HMAC verification)
        f2_generated = crypto.generate_hmac(user_profile['hmac_key_k1'], message_m)

        if f1_from_user != f2_generated:
            record_transaction(user_account['id'], None, 0, 'aborted', 'HMAC mismatch')
<<<<<<< HEAD
            return jsonify({"status": "error", "message": "Data integrity compromised (HMAC mismatch)"}), 403
=======
            return JSONResponse(status_code=403, content={"status": "error", "message": "Data integrity compromised (HMAC mismatch)"})

        # 3.5 Replay Protection
        server_t = int(datetime.datetime.now(datetime.timezone.utc).timestamp())
        disable_replay_check = os.environ.get('DISABLE_REPLAY_TIME_CHECK', 'false').lower() == 'true'

        if not disable_replay_check:
            # Freshness check: T must be within 180 seconds
            if abs(server_t - t_from_client) > 180:
                return JSONResponse(status_code=403, content={"status": "error", "message": "Transaction expired (Time out of sync)"})
            
            # Sequence check: T must be strictly greater than last_t
            if t_from_client <= user_profile.get('last_t', 0):
                return JSONResponse(status_code=403, content={"status": "error", "message": "Replay attack detected (Invalid timestamp sequence)"})
>>>>>>> origin/updated

        # 4. Data extraction
        try:
            parts = message_m.split('|')
            receiver_username = parts[0].split(':')[1]
            amount = float(parts[1].split(':')[1])
        except Exception:
<<<<<<< HEAD
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
=======
            return JSONResponse(status_code=400, content={"status": "error", "message": "Invalid message format"})

        # 5. Execute transfer via Atomic Stored Procedure (Supabase RPC)
        # This handles: balance check, daily limit check, replay protection (seq), 
        # and atomic balance updates in a single DB transaction.
        try:
            rpc_params = {
                'p_sender_username': username,
                'p_receiver_username': receiver_username,
                'p_amount': float(amount),
                'p_timestamp': int(t_from_client),
                'p_reference': f"TXN-{datetime.datetime.now(datetime.timezone.utc).isoformat()}"
            }
            
            rpc_response = supabase.rpc('process_transfer_secure', rpc_params).execute()
            
            if not rpc_response.data:
                return JSONResponse(status_code=500, content={"status": "error", "message": "Database transaction failed"})
            
            result = rpc_response.data
            
            if result['status'] == 'success':
                return {
                    "status": "success",
                    "message": f"Transfer of {amount} to {receiver_username} successful",
                    "new_t": t_from_client,
                    "new_balance": result['new_balance']
                }
            elif result['status'] == 'futile':
                return JSONResponse(status_code=400, content={"status": "futile", "message": result['message']})
            else:
                return JSONResponse(status_code=403, content={"status": "error", "message": result['message']})

        except Exception as rpc_err:
            print(f"RPC Error: {rpc_err}")
            return JSONResponse(status_code=500, content={"status": "error", "message": "Atomic transaction error"})

    except Exception as e:
        print(f"Transfer error: {e}")
        return JSONResponse(status_code=500, content={"status": "error", "message": "Internal server error"})

@app.get('/user/{username}')
async def get_user(username: str, username_from_token: str = Depends(get_current_user)):
    """Get user profile and account information"""
    try:
        # For security, we might want to restrict this to the logged in user
        if username != username_from_token:
            return JSONResponse(status_code=403, content={"status": "error", "message": "Forbidden"})

        user_profile = get_user_profile(username)
        if not user_profile:
            return JSONResponse(status_code=404, content={"status": "error", "message": "User not found"})

        user_account = get_user_account(user_profile['id'])
        if not user_account:
            return JSONResponse(status_code=404, content={"status": "error", "message": "Account not found"})

        return {
>>>>>>> origin/updated
            "status": "success",
            "user": {
                "id": user_profile['id'],
                "username": user_profile['registration_number'],
                "balance": float(user_account['balance']),
                "daily_limit": float(user_profile['daily_limit']),
                "today_spent": float(user_profile['today_spent']),
            }
<<<<<<< HEAD
        }), 200
    except Exception as e:
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
=======
        }
    except Exception as e:
        print(f"Error: {e}")
        return JSONResponse(status_code=500, content={"status": "error", "message": "Internal server error"})

@app.get('/transactions/{username}')
async def get_transactions(username: str, username_from_token: str = Depends(get_current_user)):
    """Get user's transaction history (both sent and received)"""
    try:
        if username != username_from_token:
            return JSONResponse(status_code=403, content={"status": "error", "message": "Forbidden"})

        user_profile = get_user_profile(username)
        if not user_profile:
            return JSONResponse(status_code=404, content={"status": "error", "message": "User not found"})

        user_account = get_user_account(user_profile['id'])
        if not user_account:
            return JSONResponse(status_code=404, content={"status": "error", "message": "Account not found"})
>>>>>>> origin/updated

        # Fetch both sent AND received transactions
        sent_response = supabase.table('transactions').select('*').eq('sender_account_id', user_account['id']).order('created_at', desc=True).limit(20).execute()
        
<<<<<<< HEAD
        # Get receiver's profile ID to fetch received transactions
=======
        # Get received transactions
>>>>>>> origin/updated
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

<<<<<<< HEAD
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
=======
        return {
            "status": "success",
            "transactions": transactions
        }
    except Exception as e:
        print(f"Error: {e}")
        return JSONResponse(status_code=500, content={"status": "error", "message": "Internal server error"})

@app.post('/register')
async def register(data: RegisterRequest):
    """Register a new user account with cryptographic compliance"""
    try:
        username = data.username
        password = data.password
        nid = data.nid
        activation_code = data.activationCode
        mac_address = data.macAddress
        bp_hash = data.bp_hash

        if not all([username, password, nid, activation_code, mac_address, bp_hash]):
            return JSONResponse(status_code=400, content={"status": "error", "message": "Missing required registration fields"})
>>>>>>> origin/updated

        # Check if user already exists
        existing_profile = get_user_profile(username)
        if existing_profile:
<<<<<<< HEAD
            return jsonify({"status": "error", "message": "Username already exists"}), 400

        # Step 1: Create Supabase Auth user first.
        # profiles.id is a FK to auth.users.id, so we need a valid auth UUID.
        # A synthetic email is used since this app uses username-based auth.
=======
            return JSONResponse(status_code=400, content={"status": "error", "message": "Username already exists"})

        # Step 1: Create Supabase Auth user (still using raw password for Supabase Auth, 
        # but profiles table will store stretched K2)
>>>>>>> origin/updated
        synthetic_email = f"{username}@ebanking.internal"
        try:
            auth_response = supabase.auth.admin.create_user({
                "email": synthetic_email,
                "password": password,
<<<<<<< HEAD
                "email_confirm": True,          # skip email verification step
=======
                "email_confirm": True,
>>>>>>> origin/updated
                "user_metadata": {"username": username}
            })
            auth_user_id = auth_response.user.id
        except Exception as auth_err:
            print(f"Auth user creation error: {auth_err}")
<<<<<<< HEAD
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
=======
            return JSONResponse(status_code=500, content={"status": "error", "message": f"Auth error: {str(auth_err)}"})

        # Step 2: Cryptographic Key Generation
        # K2: PBKDF2 stretched password using NID as salt
        k2_stretched = crypto.stretch_password(password, nid)
        
        # K1: Physical hardware-bound key (simulated using HMAC of MAC address and username)
        k1 = crypto.generate_hmac(mac_address, f"K1_seed_{username}")
        
        last_t = 0

        profile_data = {
            'id': auth_user_id,
            'registration_number': username,
            'password_key_k2': k2_stretched,
            'fingerprint_bp': bp_hash,
            'hmac_key_k1': k1,
            'last_t': last_t,
            'daily_limit': 5000.0,
            'today_spent': 0.0,
            'nid': nid
>>>>>>> origin/updated
        }

        response = supabase.table('profiles').insert(profile_data).execute()
        if not response.data:
<<<<<<< HEAD
            # Clean up orphaned auth user if profile insert failed
=======
            # Clean up orphaned auth user
>>>>>>> origin/updated
            try:
                supabase.auth.admin.delete_user(auth_user_id)
            except Exception:
                pass
<<<<<<< HEAD
            return jsonify({"status": "error", "message": "Failed to create profile"}), 500
=======
            return JSONResponse(status_code=500, content={"status": "error", "message": "Failed to create profile"})
>>>>>>> origin/updated

        profile_id = response.data[0]['id']

        # Step 3: Create linked bank account
        account_data = {
            'profile_id': profile_id,
            'balance': 5000.0,
            'is_active': True,
            'account_number': f"ACC-{username}"
        }
        supabase.table('accounts').insert(account_data).execute()

<<<<<<< HEAD
        return jsonify({"status": "success", "message": "Account created successfully"}), 201

    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({"status": "error", "message": f"Database error: {str(e)}"}), 500

@app.route('/check-receiver/<username>', methods=['GET'])
@require_auth
def check_receiver(username):
=======
        return JSONResponse(status_code=201, content={"status": "success", "message": "Account created successfully"})

    except Exception as e:
        print(f"Registration error: {e}")
        return JSONResponse(status_code=500, content={"status": "error", "message": f"Database error: {str(e)}"})

@app.get('/check-receiver/{username}')
async def check_receiver(username: str, username_from_token: str = Depends(get_current_user)):
>>>>>>> origin/updated
    """Check if a receiver username exists"""
    try:
        profile = get_user_profile(username)
        if not profile:
<<<<<<< HEAD
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
    requested_path = os.path.realpath(os.path.join(dist_dir, path))
    if requested_path.startswith(dist_dir) and os.path.isfile(requested_path):
        return send_from_directory(dist_dir, os.path.relpath(requested_path, dist_dir))
    return app.send_static_file('index.html')

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors by serving index.html for SPA routing"""
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
=======
            return JSONResponse(status_code=404, content={"status": "error", "message": "Receiver not found"})
        return {"status": "success", "username": profile['registration_number']}
    except Exception as e:
        print(f"Check receiver error: {e}")
        return JSONResponse(status_code=500, content={"status": "error", "message": "Internal server error"})

# ========================================
# Static file serving and catch-all for SPA
# ========================================

# Serve static files from 'dist'
if os.path.exists("dist"):
    # First, mount assets
    if os.path.exists("dist/assets"):
        app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")

@app.get("/{path_name:path}")
async def catch_all(path_name: str):
    """Serve static files or index.html for SPA routing"""
    if path_name == "":
        index_path = os.path.join("dist", "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
    
    # Check if the requested path is a file in dist
    file_path = os.path.join("dist", path_name)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    
    # Fallback to index.html for SPA
    index_path = os.path.join("dist", "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    
    return JSONResponse(status_code=404, content={"status": "error", "message": "Not Found"})

if __name__ == '__main__':
    import uvicorn
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run(app, host='0.0.0.0', port=port)
>>>>>>> origin/updated
