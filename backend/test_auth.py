#!/usr/bin/env python3
"""
Test script to check authentication and record creation
"""

import asyncio
import httpx
from app.core.auth import create_access_token
from app.services.user_service import user_service

async def test_auth_and_record():
    """Test authentication and record creation"""
    print("🔍 Testing Authentication and Record Creation...")
    print("=" * 60)
    
    try:
        # Test with a real user ID (you'll need to replace this with an actual user ID from your database)
        print("📋 Checking users in database...")
        
        # Get the first user from the database
        from app.core.database import get_db
        db = get_db()
        users_result = db.table("users").select("*").limit(1).execute()
        
        if not users_result.data:
            print("❌ No users found in database")
            print("💡 Please sign in with Google first to create a user")
            return
        
        user = users_result.data[0]
        user_id = user['id']
        print(f"✅ Found user: {user['name']} ({user['email']})")
        print(f"   User ID: {user_id}")
        
        # Create a test token
        print("\n🔑 Creating test JWT token...")
        token = create_access_token(data={"sub": user_id})
        print(f"✅ Token created: {token[:50]}...")
        
        # Test API endpoints
        async with httpx.AsyncClient() as client:
            base_url = "http://localhost:8000/api/v1"
            headers = {"Authorization": f"Bearer {token}"}
            
            # Test auth/me endpoint
            print("\n👤 Testing /auth/me endpoint...")
            try:
                response = await client.get(f"{base_url}/auth/me", headers=headers)
                if response.status_code == 200:
                    user_data = response.json()
                    print(f"✅ Auth successful - User: {user_data['name']}")
                else:
                    print(f"❌ Auth failed - Status: {response.status_code}")
                    print(f"   Response: {response.text}")
                    return
            except Exception as e:
                print(f"❌ Auth error: {e}")
                return
            
            # Test record creation
            print("\n📝 Testing record creation...")
            test_record = {
                "title": "Test Record",
                "script": "This is a test script for testing purposes.",
                "description": "Test description"
            }
            
            try:
                response = await client.post(f"{base_url}/records/", json=test_record, headers=headers)
                if response.status_code == 200:
                    record_data = response.json()
                    print(f"✅ Record created successfully!")
                    print(f"   Record ID: {record_data['id']}")
                    print(f"   Title: {record_data['title']}")
                    
                    # Clean up test record
                    print("\n🧹 Cleaning up test record...")
                    delete_response = await client.delete(f"{base_url}/records/{record_data['id']}", headers=headers)
                    if delete_response.status_code == 200:
                        print("✅ Test record deleted successfully")
                    else:
                        print(f"⚠️  Could not delete test record: {delete_response.status_code}")
                        
                else:
                    print(f"❌ Record creation failed - Status: {response.status_code}")
                    print(f"   Response: {response.text}")
            except Exception as e:
                print(f"❌ Record creation error: {e}")
        
        print("\n🎉 Authentication and record creation test completed!")
        
    except Exception as e:
        print(f"❌ Test error: {e}")
        print("\n💡 Make sure:")
        print("1. Backend is running on http://localhost:8000")
        print("2. Database schema is set up correctly")
        print("3. You have signed in with Google at least once")

if __name__ == "__main__":
    asyncio.run(test_auth_and_record())
