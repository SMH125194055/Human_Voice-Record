#!/usr/bin/env python3
"""
Test script to check database connection and table existence
"""

import asyncio
from app.core.database import get_db
from app.core.config import settings

async def test_database():
    """Test database connection and tables"""
    print("🔍 Testing Database Connection...")
    print("=" * 50)
    
    try:
        # Get database client
        db = get_db()
        print("✅ Database client created successfully")
        
        # Test connection by checking if tables exist
        print("\n📋 Checking tables...")
        
        # Check users table
        try:
            result = db.table("users").select("count", count="exact").execute()
            print(f"✅ Users table exists - {result.count} records")
        except Exception as e:
            print(f"❌ Users table error: {e}")
        
        # Check records table
        try:
            result = db.table("records").select("count", count="exact").execute()
            print(f"✅ Records table exists - {result.count} records")
        except Exception as e:
            print(f"❌ Records table error: {e}")
        
        # Test creating a simple record
        print("\n🧪 Testing record creation...")
        try:
            test_record = {
                "title": "Test Record",
                "script": "This is a test script",
                "description": "Test description",
                "user_id": "test-user-id"
            }
            
            result = db.table("records").insert(test_record).execute()
            print("✅ Test record created successfully")
            
            # Clean up test record
            db.table("records").delete().eq("user_id", "test-user-id").execute()
            print("✅ Test record cleaned up")
            
        except Exception as e:
            print(f"❌ Record creation error: {e}")
        
        print("\n🎉 Database test completed!")
        
    except Exception as e:
        print(f"❌ Database connection error: {e}")
        print("\n💡 Make sure you have:")
        print("1. Run the SQL schema in Supabase")
        print("2. Set up the .env file correctly")
        print("3. Supabase project is active")

if __name__ == "__main__":
    asyncio.run(test_database())

