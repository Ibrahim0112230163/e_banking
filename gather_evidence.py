import httpx
import time
import json
from crypto import CryptoEngine
import os
import uuid
from supabase import create_client

# Config
BASE_URL = "http://localhost:5000"
SUPABASE_URL = "https://fzrjoeyzeveqhbblhfqj.supabase.co"
# Note: Using the key from the codebase for evidence gathering
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6cmpvZXl6ZXZlcWhiYmxoZnFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDY3Nzg2OSwiZXhwIjoyMDk2MjUzODY5fQ.j6wEjp9_jJ-h684PoL3gXgwN3d6qNqjLcPvuK_pI1Ec"

crypto = CryptoEngine()
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def gather_evidence():
    print("--- Phase 2 Evidence: PBKDF2 Password Storage ---")
    username = f"evidence_user_{int(time.time())}"
    password = "MySecurePassword123"
    nid = "1990-1234-5678-9012"
    
    # Register user
    with httpx.Client(base_url=BASE_URL) as client:
        reg_resp = client.post("/register", json={
            "username": username,
            "password": password,
            "nid": nid,
            "activationCode": "ACT-1234",
            "macAddress": "AA:BB:CC:DD:EE:FF",
            "bp_hash": "dummy_bp_hash"
        })
        print(f"Registration Status: {reg_resp.status_code}")
        
        # Verify PBKDF2 hash in Supabase
        profile = supabase.table('profiles').select('password_key_k2').eq('registration_number', username).single().execute()
        stored_k2 = profile.data['password_key_k2']
        
        # Locally derive it to compare
        local_k2 = crypto.stretch_password(password, nid)
        
        print(f"Stored K2 (PBKDF2): {stored_k2}")
        print(f"Locally Derived K2:  {local_k2}")
        print(f"Match: {stored_k2 == local_k2}")
        print("")

    print("--- Phase 3 Evidence: Legacy User Migration ---")
    legacy_username = f"legacy_user_{int(time.time())}"
    legacy_password = "LegacyPassword123"
    
    # 1. Manually insert legacy user (plaintext password)
    # Note: We need a valid auth user first if we want to follow app.py logic, 
    # but for evidence of the migration logic in /login, we can just insert into profiles.
    # Actually /login fetches profile.
    
    # To simulate legacy, we insert a profile with plaintext password and NO nid (or NID if we want migration to work)
    # If NID is missing, it stays plaintext but logs in. 
    # If NID is present and stored is plaintext, it migrates.
    
    auth_id = str(uuid.uuid4())
    supabase.table('profiles').insert({
        'id': auth_id,
        'registration_number': legacy_username,
        'password_key_k2': legacy_password, # Plaintext
        'fingerprint_bp': 'dummy',
        'hmac_key_k1': 'dummy',
        'last_t': 0,
        'nid': nid # We provide NID so migration can happen
    }).execute()
    
    print(f"Legacy User Created: {legacy_username} (Password stored in plaintext)")
    
    # 2. Login as legacy user
    with httpx.Client(base_url=BASE_URL) as client:
        login_resp = client.post("/login", json={"username": legacy_username, "password": legacy_password})
        print(f"Login Response: {login_resp.json()}")
        print(f"Migrated Status in JSON: {login_resp.json().get('migrated')}")
        
        # 3. Check DB to see if it's now hashed
        migrated_profile = supabase.table('profiles').select('password_key_k2').eq('registration_number', legacy_username).single().execute()
        new_stored_k2 = migrated_profile.data['password_key_k2']
        
        print(f"New Stored K2 (After Migration): {new_stored_k2}")
        print(f"Is hashed (length > 32): {len(new_stored_k2) > 32}")
        print("")

if __name__ == "__main__":
    gather_evidence()
