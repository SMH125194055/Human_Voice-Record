#!/usr/bin/env python3
"""
Simple script to help set up environment variables
"""

import os
import secrets

def generate_jwt_secret():
    """Generate a secure JWT secret key"""
    return secrets.token_urlsafe(32)

def setup_env():
    """Interactive setup for environment variables"""
    print("🔧 Human Record - Environment Setup")
    print("=" * 50)
    
    # Read current .env file
    env_file = ".env"
    if os.path.exists(env_file):
        with open(env_file, 'r') as f:
            current_content = f.read()
    else:
        print("❌ .env file not found!")
        return
    
    # Get Supabase credentials
    print("\n📋 Supabase Configuration:")
    print("Go to your Supabase dashboard → Settings → API")
    supabase_url = input("Enter your SupABASE_URL: ").strip()
    supabase_key = input("Enter your SUPABASE_KEY (anon public key): ").strip()
    supabase_service_key = input("Enter your SUPABASE_SERVICE_KEY: ").strip()
    
    # Get Google OAuth credentials
    print("\n🔐 Google OAuth Configuration:")
    print("Go to Google Cloud Console → APIs & Services → Credentials")
    google_client_id = input("Enter your GOOGLE_CLIENT_ID: ").strip()
    google_client_secret = input("Enter your GOOGLE_CLIENT_SECRET: ").strip()
    
    # Generate JWT secret
    jwt_secret = generate_jwt_secret()
    print(f"\n🔑 Generated JWT_SECRET_KEY: {jwt_secret}")
    
    # Update .env content
    new_content = current_content.replace("your_supabase_url_here", supabase_url)
    new_content = new_content.replace("your_supabase_anon_key_here", supabase_key)
    new_content = new_content.replace("your_supabase_service_key_here", supabase_service_key)
    new_content = new_content.replace("your_google_client_id_here", google_client_id)
    new_content = new_content.replace("your_google_client_secret_here", google_client_secret)
    new_content = new_content.replace("your_jwt_secret_key_here", jwt_secret)
    
    # Write updated .env file
    with open(env_file, 'w') as f:
        f.write(new_content)
    
    print("\n✅ Environment variables configured successfully!")
    print("📝 You can now start the backend server.")

if __name__ == "__main__":
    setup_env()

