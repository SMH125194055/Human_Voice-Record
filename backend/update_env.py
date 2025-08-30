#!/usr/bin/env python3
"""
Script to update missing environment variables
"""

import os

def update_env():
    """Update missing environment variables"""
    print("🔧 Updating Environment Variables")
    print("=" * 40)
    
    # Read current .env file
    with open('.env', 'r') as f:
        content = f.read()
    
    print("Current .env file:")
    print(content)
    print("\n" + "=" * 40)
    
    # Check what's missing
    missing = []
    if "your_anon_public_key_here" in content:
        missing.append("SUPABASE_KEY")
    if "your_service_role_key_here" in content:
        missing.append("SUPABASE_SERVICE_KEY")
    if "your_google_client_id_here" in content:
        missing.append("GOOGLE_CLIENT_ID")
    if "your_google_client_secret_here" in content:
        missing.append("GOOGLE_CLIENT_SECRET")
    
    if missing:
        print(f"❌ Missing credentials: {', '.join(missing)}")
        print("\n📋 To get these credentials:")
        print("1. Supabase keys: Go to https://supabase.com/dashboard/project/ihwnekrktttmhbrdoskt/settings/api-keys")
        print("2. Google OAuth: Go to https://console.cloud.google.com/apis/credentials")
        print("\n💡 You can manually edit the .env file or run this script again after getting the credentials.")
    else:
        print("✅ All environment variables are configured!")
        print("🚀 You can now start the backend server.")

if __name__ == "__main__":
    update_env()

