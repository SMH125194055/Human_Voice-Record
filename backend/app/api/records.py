from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File
from typing import List
from app.models.record import Record, RecordCreate, RecordUpdate
from app.models.user import User
from app.services.record_service import record_service
from app.api.deps import get_current_user
from app.core.config import settings
import aiofiles
import os
from datetime import datetime

router = APIRouter(prefix="/records", tags=["records"])


@router.post("/", response_model=Record)
async def create_record(
    record_data: RecordCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new record"""
    return await record_service.create_record(record_data, current_user.id)


@router.get("/", response_model=List[Record])
async def get_records(current_user: User = Depends(get_current_user)):
    """Get all records for the current user"""
    return await record_service.get_records_by_user(current_user.id)


@router.get("/{record_id}", response_model=Record)
async def get_record(
    record_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get a specific record"""
    record = await record_service.get_record_by_id(record_id, current_user.id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Record not found"
        )
    return record


@router.put("/{record_id}", response_model=Record)
async def update_record(
    record_id: str,
    record_data: RecordUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update a record"""
    record = await record_service.update_record(record_id, current_user.id, record_data)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Record not found"
        )
    return record


@router.delete("/{record_id}")
async def delete_record(
    record_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a record"""
    success = await record_service.delete_record(record_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Record not found"
        )
    return {"message": "Record deleted successfully"}


@router.post("/{record_id}/upload-audio")
async def upload_audio(
    record_id: str,
    audio_file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Upload audio file for a record"""
    # Check if record exists
    record = await record_service.get_record_by_id(record_id, current_user.id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Record not found"
        )
    
    # Validate file type
    if not audio_file.content_type.startswith("audio/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an audio file"
        )
    
    try:
        # Read file content directly (no local file saving)
        content = await audio_file.read()
        
        # Create filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_extension = os.path.splitext(audio_file.filename)[1]
        filename = f"{record_id}_{timestamp}{file_extension}"
        
        # Upload directly to Supabase Storage
        updated_record = await record_service.upload_audio_to_storage(
            record_id, 
            current_user.id, 
            content,
            filename,
            audio_file.content_type
        )
        
        if not updated_record:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to upload audio to storage"
            )
        
        return {
            "message": "Audio file uploaded successfully",
            "audio_url": updated_record.audio_file_path,
            "record": updated_record
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload audio: {str(e)}"
        )


@router.get("/{record_id}/audio")
async def get_audio_file(
    record_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get audio file URL for a record"""
    record = await record_service.get_record_by_id(record_id, current_user.id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Record not found"
        )
    
    if not record.audio_file_path:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No audio file found for this record"
        )
    
    return {"audio_url": record.audio_file_path}
