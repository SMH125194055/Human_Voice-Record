#!/usr/bin/env python3
"""
Script to clean up existing audio URLs by removing trailing question marks
"""

import asyncio
from app.core.database import get_db

async def cleanup_audio_urls():
    """Clean up existing audio URLs by removing trailing question marks"""
    print("🧹 Cleaning up audio URLs...")
    print("=" * 50)
    
    try:
        db = get_db()
        
        # Get all records with audio file paths
        result = db.table("records").select("*").not_.is_("audio_file_path", "null").execute()
        
        if not result.data:
            print("✅ No records with audio files found")
            return
        
        print(f"📋 Found {len(result.data)} records with audio files")
        
        updated_count = 0
        for record in result.data:
            audio_path = record.get('audio_file_path')
            if audio_path and audio_path.endswith('?'):
                # Remove trailing question mark
                clean_path = audio_path[:-1]
                
                # Update the record
                update_result = db.table("records").update({
                    "audio_file_path": clean_path
                }).eq("id", record['id']).execute()
                
                if update_result.data:
                    print(f"✅ Updated record {record['id']}: {audio_path} -> {clean_path}")
                    updated_count += 1
                else:
                    print(f"❌ Failed to update record {record['id']}")
            else:
                print(f"ℹ️  Record {record['id']} already has clean URL: {audio_path}")
        
        print(f"\n🎉 Cleanup completed! Updated {updated_count} records")
        
    except Exception as e:
        print(f"❌ Cleanup error: {e}")

if __name__ == "__main__":
    asyncio.run(cleanup_audio_urls())
