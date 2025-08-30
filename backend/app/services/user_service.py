from typing import Optional, List
from app.core.database import get_db
from app.models.user import UserCreate, User
from supabase import Client


class UserService:
    def __init__(self):
        self.db: Client = get_db()
    
    async def create_user(self, user_data: UserCreate) -> User:
        """Create a new user"""
        user_dict = user_data.dict()
        user_dict["created_at"] = "now()"
        user_dict["updated_at"] = "now()"
        
        result = self.db.table("users").insert(user_dict).execute()
        return User(**result.data[0])
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        result = self.db.table("users").select("*").eq("email", email).execute()
        if result.data:
            return User(**result.data[0])
        return None
    
    async def get_user_by_google_id(self, google_id: str) -> Optional[User]:
        """Get user by Google ID"""
        result = self.db.table("users").select("*").eq("google_id", google_id).execute()
        if result.data:
            return User(**result.data[0])
        return None
    
    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID"""
        result = self.db.table("users").select("*").eq("id", user_id).execute()
        if result.data:
            return User(**result.data[0])
        return None
    
    async def update_user(self, user_id: str, user_data: dict) -> Optional[User]:
        """Update user"""
        user_data["updated_at"] = "now()"
        result = self.db.table("users").update(user_data).eq("id", user_id).execute()
        if result.data:
            return User(**result.data[0])
        return None
    
    async def delete_user(self, user_id: str) -> bool:
        """Delete user"""
        result = self.db.table("users").delete().eq("id", user_id).execute()
        return len(result.data) > 0


# Service instance
user_service = UserService()

