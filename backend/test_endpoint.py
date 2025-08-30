#!/usr/bin/env python3
"""
Test script to check API endpoints and identify the 307 redirect issue
"""

import asyncio
import httpx
from app.core.auth import create_access_token

async def test_endpoints():
    """Test API endpoints to identify the issue"""
    print("🔍 Testing API Endpoints...")
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
        
        async with httpx.AsyncClient(follow_redirects=False) as client:
            base_url = "http://localhost:8000"
            headers = {"Authorization": f"Bearer {token}"}
            
            # Test different endpoints
            endpoints = [
                "/api/v1/records",
                "/api/v1/records/",
                "/records",
                "/records/"
            ]
            
            for endpoint in endpoints:
                print(f"\n🔗 Testing: {endpoint}")
                try:
                    response = await client.post(
                        f"{base_url}{endpoint}",
                        json={
                            "title": "Test Record",
                            "script": "Test script",
                            "description": "Test description"
                        },
                        headers=headers
                    )
                    print(f"   Status: {response.status_code}")
                    print(f"   Headers: {dict(response.headers)}")
                    if response.status_code == 307:
                        print(f"   Redirect Location: {response.headers.get('location', 'None')}")
                    print(f"   Response: {response.text[:200]}")
                except Exception as e:
                    print(f"   Error: {e}")
            
            # Test GET request to see if endpoint exists
            print(f"\n🔍 Testing GET request to /api/v1/records")
            try:
                response = await client.get(f"{base_url}/api/v1/records", headers=headers)
                print(f"   Status: {response.status_code}")
                print(f"   Response: {response.text[:200]}")
            except Exception as e:
                print(f"   Error: {e}")
        
    except Exception as e:
        print(f"❌ Test error: {e}")

if __name__ == "__main__":
    asyncio.run(test_endpoints())

