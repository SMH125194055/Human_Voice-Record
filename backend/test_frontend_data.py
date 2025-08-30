#!/usr/bin/env python3
"""
Test script to check what data is being returned to frontend
"""

import asyncio
import httpx
from app.core.auth import create_access_token

async def test_frontend_data():
    """Test what data is being returned to frontend"""
    print("🔍 Testing Frontend Data...")
    print("=" * 50)
    
    try:
        # Get a user ID from the database
        from app.core.database import get_db
        db = get_db()
        users_result = db.table("users").select("*").limit(1).execute()
        
        if not users_result.data:
            print("❌ No users found")
            return
        
        user_id = users_result.data[0]['id']
        token = create_access_token(data={"sub": user_id})
        
        async with httpx.AsyncClient() as client:
            base_url = "http://localhost:8000/api/v1"
            headers = {"Authorization": f"Bearer {token}"}
            
            # Get all records
            print("📋 Getting all records...")
            response = await client.get(f"{base_url}/records/", headers=headers)
            
            if response.status_code == 200:
                records = response.json()
                print(f"✅ Found {len(records)} records")
                
                for i, record in enumerate(records):
                    print(f"\n📝 Record {i+1}:")
                    print(f"   ID: {record.get('id')}")
                    print(f"   Title: {record.get('title')}")
                    print(f"   Audio File Path: {record.get('audio_file_path', 'None')}")
                    print(f"   Duration: {record.get('duration', 'None')}")
                    print(f"   Has Audio: {'Yes' if record.get('audio_file_path') else 'No'}")
                    
                    # If there's an audio file, test if it's accessible
                    if record.get('audio_file_path'):
                        print(f"   Audio URL: {record.get('audio_file_path')}")
                        # Test if the URL is accessible
                        try:
                            audio_response = await client.head(record.get('audio_file_path'))
                            print(f"   Audio Accessible: {'Yes' if audio_response.status_code == 200 else 'No'}")
                        except Exception as e:
                            print(f"   Audio Accessible: No (Error: {e})")
            else:
                print(f"❌ Failed to get records: {response.status_code}")
                print(f"   Response: {response.text}")
        
    except Exception as e:
        print(f"❌ Test error: {e}")

if __name__ == "__main__":
    asyncio.run(test_frontend_data())
