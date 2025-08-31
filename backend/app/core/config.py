from pydantic import BaseSettings, Field
import os
from typing import Optional


class Settings(BaseSettings):
    # Database Configuration
    supabase_url: str = Field(default="https://your-project.supabase.co")
    supabase_key: str = Field(default="your-supabase-anon-key")
    
    # JWT Configuration
    jwt_secret_key: str = Field(default="your-secret-key")
    jwt_algorithm: str = Field(default="HS256")
    jwt_expire_minutes: int = Field(default=30)
    
    # Google OAuth Configuration
    google_client_id: str = "774653109986-mt4kacjdb5t5j34bgq05lnd6f360s67b.apps.googleusercontent.com"
    google_client_secret: str = None
    google_redirect_uri: str = None

    # Application Configuration
    cors_origins: str = "http://localhost:3000,http://localhost:5173,https://*.vercel.app"
    upload_dir: str = "uploads"
    
    # Fixed Production URLs (to avoid URL change issues)
    production_backend_url: str = "https://hvr-huzaifa-backend.vercel.app"
    production_frontend_url: str = "https://hvr-huzaifa-frontend.vercel.app"
    
    class Config:
        env_file = ".env"
        fields = {
            "supabase_url": {"env": "SUPABASE_URL"},
            "supabase_key": {"env": "SUPABASE_KEY"},
            "jwt_secret_key": {"env": "JWT_SECRET_KEY"},
            "google_client_id": {"env": "GOOGLE_CLIENT_ID"},
            "google_client_secret": {"env": "GOOGLE_CLIENT_SECRET"},
            "google_redirect_uri": {"env": "GOOGLE_REDIRECT_URI"},
            "cors_origins": {"env": "CORS_ORIGINS"},
            "upload_dir": {"env": "UPLOAD_DIR"},
        }


# Create settings instance
settings = Settings()
