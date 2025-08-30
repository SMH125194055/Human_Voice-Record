#!/usr/bin/env python3
"""
Test script to check audio upload functionality
"""

import asyncio
import httpx
import os
from app.core.auth import create_access_token

async def test_audio_upload():
    """Test audio upload functionality"""
    print("🔍 Testing Audio Upload Functionality...")
    print("=" * 60)
    
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
            
            # First create a record
            print("📝 Creating test record...")
            record_data = {
                "title": "Audio Test Record",
                "script": "This is a test script for audio upload.",
                "description": "Testing audio upload functionality"
            }
            
            response = await client.post(f"{base_url}/records/", json=record_data, headers=headers)
            if response.status_code != 200:
                print(f"❌ Failed to create record: {response.status_code}")
                print(f"   Response: {response.text}")
                return
            
            record = response.json()
            record_id = record['id']
            print(f"✅ Record created: {record_id}")
            
            # Create a test audio file
            print("\n🎵 Creating test audio file...")
            test_audio_content = b"RIFF\x24\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00\x44\xAC\x00\x00\x88X\x01\x00\x02\x00\x10\x00data\x00\x00\x00\x00"
            test_audio_path = "test_audio.wav"
            
            with open(test_audio_path, "wb") as f:
                f.write(test_audio_content)
            
            # Upload audio file
            print("📤 Uploading audio file...")
            with open(test_audio_path, "rb") as f:
                files = {"audio_file": ("test_audio.wav", f, "audio/wav")}
                upload_response = await client.post(
                    f"{base_url}/records/{record_id}/upload-audio",
                    files=files,
                    headers={"Authorization": f"Bearer {token}"}
                )
            
            if upload_response.status_code == 200:
                upload_result = upload_response.json()
                print("✅ Audio uploaded successfully!")
                print(f"   Audio URL: {upload_result.get('audio_url', 'N/A')}")
                print(f"   Record: {upload_result.get('record', {}).get('audio_file_path', 'N/A')}")
                
                # Check if audio file path is saved in database
                print("\n🔍 Checking database for audio file path...")
                record_response = await client.get(f"{base_url}/records/{record_id}", headers=headers)
                if record_response.status_code == 200:
                    updated_record = record_response.json()
                    audio_path = updated_record.get('audio_file_path')
                    if audio_path:
                        print(f"✅ Audio file path saved in database: {audio_path}")
                    else:
                        print("❌ Audio file path not found in database")
                else:
                    print(f"❌ Failed to get updated record: {record_response.status_code}")
                
            else:
                print(f"❌ Audio upload failed: {upload_response.status_code}")
                print(f"   Response: {upload_response.text}")
            
            # Clean up
            print("\n🧹 Cleaning up...")
            try:
                os.remove(test_audio_path)
                await client.delete(f"{base_url}/records/{record_id}", headers=headers)
                print("✅ Test files cleaned up")
            except Exception as e:
                print(f"⚠️  Cleanup warning: {e}")
        
    except Exception as e:
        print(f"❌ Test error: {e}")

if __name__ == "__main__":
    asyncio.run(test_audio_upload())
