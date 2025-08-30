from supabase import Client
from app.core.database import get_service_db
from app.core.config import settings
import os
from typing import Optional
import uuid


class StorageService:
    def __init__(self):
        self.db: Client = get_service_db()  # Use service client with admin privileges
        self.bucket_name = "audio-recordings"
    
    async def create_bucket_if_not_exists(self):
        """Create the audio recordings bucket if it doesn't exist"""
        try:
            # Check if bucket exists by trying to list files (this will fail if bucket doesn't exist)
            try:
                self.db.storage.from_(self.bucket_name).list()
                print(f"✅ Bucket already exists: {self.bucket_name}")
                return
            except Exception as list_error:
                # If listing fails, bucket might not exist, try to create it
                print(f"📋 Bucket might not exist, attempting to create: {self.bucket_name}")
                
                try:
                    # Create bucket with public access for audio files
                    self.db.storage.create_bucket(
                        self.bucket_name,
                        options={
                            "public": True,
                            "allowedMimeTypes": ["audio/*"],
                            "fileSizeLimit": 52428800  # 50MB limit
                        }
                    )
                    print(f"✅ Created bucket: {self.bucket_name}")
                except Exception as create_error:
                    # If creation fails due to RLS, the bucket might already exist
                    print(f"⚠️  Could not create bucket (might already exist): {create_error}")
                    # Try listing again to confirm bucket exists
                    try:
                        self.db.storage.from_(self.bucket_name).list()
                        print(f"✅ Bucket exists and is accessible: {self.bucket_name}")
                    except Exception as final_error:
                        print(f"❌ Bucket is not accessible: {final_error}")
                        raise final_error
                        
        except Exception as e:
            print(f"❌ Error with bucket operations: {e}")
            # Don't raise the error, just log it and continue
            # The upload might still work if the bucket exists
    
    async def upload_audio_file(self, user_id: str, record_id: str, audio_file_path: str, file_extension: str = ".wav") -> Optional[str]:
        """Upload audio file to user-specific folder in storage bucket"""
        try:
            # Ensure bucket exists (but don't fail if we can't create it)
            await self.create_bucket_if_not_exists()
            
            # Check if file exists
            if not os.path.exists(audio_file_path):
                print(f"❌ File not found: {audio_file_path}")
                return None
            
            # Create user-specific folder path
            folder_path = f"users/{user_id}/records/{record_id}"
            
            # Generate unique filename
            filename = f"recording_{uuid.uuid4().hex}{file_extension}"
            storage_path = f"{folder_path}/{filename}"
            
            print(f"📁 Uploading to: {storage_path}")
            
            # Read file content
            with open(audio_file_path, 'rb') as f:
                file_content = f.read()
            
            print(f"📊 File size: {len(file_content)} bytes")
            
            # Upload to Supabase Storage with proper content type
            result = self.db.storage.from_(self.bucket_name).upload(
                storage_path,
                file_content,
                {"content-type": "audio/wav"}
            )
            
            if result:
                # Get public URL and clean it (remove trailing ? if present)
                public_url = self.db.storage.from_(self.bucket_name).get_public_url(storage_path)
                # Clean the URL by removing trailing question mark
                if public_url.endswith('?'):
                    public_url = public_url[:-1]
                print(f"✅ Upload successful: {public_url}")
                return public_url
            else:
                print("❌ Upload failed - no result returned")
                return None
            
        except Exception as e:
            print(f"❌ Error uploading to storage: {e}")
            import traceback
            traceback.print_exc()
            return None
    
    async def delete_audio_file(self, user_id: str, record_id: str, filename: str) -> bool:
        """Delete audio file from storage"""
        try:
            storage_path = f"users/{user_id}/records/{record_id}/{filename}"
            result = self.db.storage.from_(self.bucket_name).remove([storage_path])
            return True
        except Exception as e:
            print(f"Error deleting from storage: {e}")
            return False
    
    async def get_audio_url(self, user_id: str, record_id: str, filename: str) -> Optional[str]:
        """Get public URL for audio file"""
        try:
            storage_path = f"users/{user_id}/records/{record_id}/{filename}"
            public_url = self.db.storage.from_(self.bucket_name).get_public_url(storage_path)
            # Clean the URL by removing trailing question mark
            if public_url.endswith('?'):
                public_url = public_url[:-1]
            return public_url
        except Exception as e:
            print(f"Error getting audio URL: {e}")
            return None


# Storage service instance
storage_service = StorageService()
