from supabase import create_client, Client
from app.core.config import settings
from typing import Optional


class Database:
    def __init__(self):
        self.client: Optional[Client] = None
        self.service_client: Optional[Client] = None
    
    def connect(self):
        """Create database connection"""
        self.client = create_client(settings.supabase_url, settings.supabase_key)
        return self.client
    
    def connect_service(self):
        """Create service database connection with admin privileges"""
        self.service_client = create_client(settings.supabase_url, settings.supabase_service_key)
        return self.service_client
    
    def disconnect(self):
        """Close database connection"""
        self.client = None
        self.service_client = None
    
    def get_client(self) -> Client:
        """Get database client"""
        if not self.client:
            self.connect()
        return self.client
    
    def get_service_client(self) -> Client:
        """Get service database client with admin privileges"""
        if not self.service_client:
            self.connect_service()
        return self.service_client


# Database instance
db = Database()


def get_db() -> Client:
    """Dependency to get database client"""
    return db.get_client()


def get_service_db() -> Client:
    """Dependency to get service database client with admin privileges"""
    return db.get_service_client()

