from typing import Optional, List
from app.core.database import get_db
from app.models.record import RecordCreate, RecordUpdate, Record
from app.services.storage_service import storage_service
from supabase import Client
import os


class RecordService:
    def __init__(self):
        self.db: Client = get_db()
    
    async def create_record(self, record_data: RecordCreate, user_id: str) -> Record:
        """Create a new record"""
        record_dict = record_data.model_dump()
        record_dict["user_id"] = user_id
        record_dict["created_at"] = "now()"
        record_dict["updated_at"] = "now()"
        
        result = self.db.table("records").insert(record_dict).execute()
        return Record(**result.data[0])
    
    async def get_records_by_user(self, user_id: str) -> List[Record]:
        """Get all records for a user"""
        result = self.db.table("records").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return [Record(**record) for record in result.data]
    
    async def get_record_by_id(self, record_id: str, user_id: str) -> Optional[Record]:
        """Get a specific record by ID"""
        result = self.db.table("records").select("*").eq("id", record_id).eq("user_id", user_id).execute()
        if result.data:
            return Record(**result.data[0])
        return None
    
    async def update_record(self, record_id: str, user_id: str, record_data: RecordUpdate) -> Optional[Record]:
        """Update a record"""
        update_data = {k: v for k, v in record_data.model_dump().items() if v is not None}
        update_data["updated_at"] = "now()"
        
        result = self.db.table("records").update(update_data).eq("id", record_id).eq("user_id", user_id).execute()
        if result.data:
            return Record(**result.data[0])
        return None
    
    async def delete_record(self, record_id: str, user_id: str) -> bool:
        """Delete a record and its associated audio file"""
        try:
            # Get record to check if it has audio file
            record = await self.get_record_by_id(record_id, user_id)
            if record and record.audio_file_path:
                # Extract filename from the storage URL
                # URL format: https://xxx.supabase.co/storage/v1/object/public/audio-recordings/users/xxx/records/xxx/filename.wav
                url_parts = record.audio_file_path.split('/')
                if len(url_parts) >= 2:
                    filename = url_parts[-1]
                    # Delete from storage
                    await storage_service.delete_audio_file(user_id, record_id, filename)
            
            # Delete from database
            result = self.db.table("records").delete().eq("id", record_id).eq("user_id", user_id).execute()
            return len(result.data) > 0
        except Exception as e:
            print(f"Error deleting record: {e}")
            return False
    
    async def update_audio_file(self, record_id: str, user_id: str, audio_file_path: str, duration: float = None) -> Optional[Record]:
        """Update record with audio file information using Supabase Storage"""
        try:
            # Upload to Supabase Storage
            storage_url = await storage_service.upload_audio_file(user_id, record_id, audio_file_path)
            
            if storage_url:
                update_data = {
                    "audio_file_path": storage_url,
                    "updated_at": "now()"
                }
                if duration:
                    update_data["duration"] = duration
                
                result = self.db.table("records").update(update_data).eq("id", record_id).eq("user_id", user_id).execute()
                if result.data:
                    return Record(**result.data[0])
            
            return None
        except Exception as e:
            print(f"Error updating audio file: {e}")
            return None


# Service instance
record_service = RecordService()
