from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class RecordBase(BaseModel):
    title: str
    script: str
    description: Optional[str] = None


class RecordCreate(RecordBase):
    pass


class RecordUpdate(BaseModel):
    title: Optional[str] = None
    script: Optional[str] = None
    description: Optional[str] = None
    audio_file_path: Optional[str] = None


class Record(RecordBase):
    id: str
    user_id: str
    audio_file_path: Optional[str] = None
    duration: Optional[float] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class RecordInDB(Record):
    pass
