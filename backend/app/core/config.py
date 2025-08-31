from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # Supabase Configuration
    supabase_url: str = None
    supabase_key: str = None
    supabase_service_key: str = None
    
    # Google OAuth Configuration
    google_client_id: str = "774653109986-mt4kacjdb5t5j34bgq05lnd6f360s67b.apps.googleusercontent.com"
    google_client_secret: str = None
    google_redirect_uri: str = None
    
    # JWT Configuration
    jwt_secret_key: str = None
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Application Configuration
    cors_origins: str = "http://localhost:3000,http://localhost:5173,https://*.vercel.app"
    upload_dir: str = "uploads"
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        # Map environment variable names
        fields = {
            'supabase_url': {'env': 'SUPABASE_URL'},
            'supabase_key': {'env': 'SUPABASE_KEY'},
            'supabase_service_key': {'env': 'SUPABASE_SERVICE_KEY'},
            'google_client_id': {'env': 'GOOGLE_CLIENT_ID'},
            'google_client_secret': {'env': 'GOOGLE_CLIENT_SECRET'},
            'google_redirect_uri': {'env': 'GOOGLE_REDIRECT_URI'},
            'jwt_secret_key': {'env': 'JWT_SECRET_KEY'},
            'jwt_algorithm': {'env': 'JWT_ALGORITHM'},
            'access_token_expire_minutes': {'env': 'ACCESS_TOKEN_EXPIRE_MINUTES'},
            'cors_origins': {'env': 'CORS_ORIGINS'},
            'upload_dir': {'env': 'UPLOAD_DIR'},
        }


settings = Settings()

# Note: Directory creation moved to main.py to avoid read-only file system issues in Vercel
