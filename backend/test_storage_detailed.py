#!/usr/bin/env python3
"""
Detailed test script to debug storage service issues
"""

import asyncio
import os
from app.core.database import get_db
from app.services.storage_service import storage_service

async def test_storage_detailed():
    """Test storage service with detailed error reporting"""
    print("🔍 Testing Storage Service (Detailed)...")
    print("=" * 60)
    
    try:
        # Test bucket creation
        print("1. Testing bucket creation...")
        await storage_service.create_bucket_if_not_exists()
        
        # Test with a real user ID
        print("\n2. Getting user from database...")
        db = get_db()
        users_result = db.table("users").select("*").limit(1).execute()
        
        if not users_result.data:
            print("❌ No users found")
            return
        
        user_id = users_result.data[0]['id']
        record_id = "test-record-123"
        print(f"✅ Using user ID: {user_id}")
        print(f"✅ Using record ID: {record_id}")
        
        # Create a test audio file
        print("\n3. Creating test audio file...")
        test_audio_content = b"RIFF\x24\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00\x44\xAC\x00\x00\x88X\x01\x00\x02\x00\x10\x00data\x00\x00\x00\x00"
        test_audio_path = "test_audio_detailed.wav"
        
        with open(test_audio_path, "wb") as f:
            f.write(test_audio_content)
        
        print(f"✅ Test file created: {test_audio_path}")
        print(f"✅ File size: {len(test_audio_content)} bytes")
        print(f"✅ File exists: {os.path.exists(test_audio_path)}")
        
        # Test upload
        print("\n4. Testing upload...")
        try:
            result = await storage_service.upload_audio_file(user_id, record_id, test_audio_path)
            if result:
                print(f"✅ Upload successful: {result}")
            else:
                print("❌ Upload returned None")
        except Exception as e:
            print(f"❌ Upload exception: {e}")
            import traceback
            traceback.print_exc()
        
        # Clean up
        print("\n5. Cleaning up...")
        try:
            os.remove(test_audio_path)
            print("✅ Test file removed")
        except Exception as e:
            print(f"⚠️  Cleanup warning: {e}")
        
    except Exception as e:
        print(f"❌ Test error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_storage_detailed())
