import os
from supabase import create_client, Client

url = "https://fzrjoeyzeveqhbblhfqj.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6cmpvZXl6ZXZlcWhiYmxoZnFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDY3Nzg2OSwiZXhwIjoyMDk2MjUzODY5fQ.j6wEjp9_jJ-h684PoL3gXgwN3d6qNqjLcPvuK_pI1Ec"
supabase: Client = create_client(url, key)

import json

def check_registration():
    try:
        response = supabase.table('profiles').select('*').execute()
        if response.data:
            print(json.dumps(response.data, indent=2))
        else:
            print("No profiles found.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_registration()
