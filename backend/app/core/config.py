from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # Supabase Configuration
    supabase_url: str
    supabase_key: str
    supabase_service_key: str
    
    # Google OAuth Configuration
    google_client_id: str
    google_client_secret: str
    google_redirect_uri: str
    
    # JWT Configuration
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Application Configuration
    cors_origins: str = "http://localhost:3000,http://localhost:5173"
    upload_dir: str = "uploads"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()

# Create upload directory if it doesn't exist
os.makedirs(settings.upload_dir, exist_ok=True)
