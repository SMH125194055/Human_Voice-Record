from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Human Record API",
    description="API for recording human voice with script input",
    version="1.0.0"
)

# Get CORS origins from environment or use default
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173,https://*.vercel.app,*")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins temporarily
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Handle upload directory for Vercel (read-only file system)
upload_dir = os.getenv("UPLOAD_DIR", "uploads")
# Only mount static files if directory exists and we're not in Vercel
if os.path.exists(upload_dir) and not os.getenv("VERCEL"):
    app.mount("/uploads", StaticFiles(directory=upload_dir), name="uploads")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Human Record API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


@app.get("/debug-raw")
async def debug_raw_env():
    """Debug raw environment variables"""
    return {
        "SUPABASE_URL": os.getenv("SUPABASE_URL"),
        "SUPABASE_KEY": os.getenv("SUPABASE_KEY", "NOT_SET")[:20] + "..." if os.getenv("SUPABASE_KEY") else "NOT_SET",
        "GOOGLE_CLIENT_ID": os.getenv("GOOGLE_CLIENT_ID"),
        "JWT_SECRET_KEY": os.getenv("JWT_SECRET_KEY", "NOT_SET")[:20] + "..." if os.getenv("JWT_SECRET_KEY") else "NOT_SET",
        "CORS_ORIGINS": os.getenv("CORS_ORIGINS"),
        "UPLOAD_DIR": os.getenv("UPLOAD_DIR"),
        "VERCEL": os.getenv("VERCEL"),
        "all_env_vars": {k: v for k, v in os.environ.items() if "SUPABASE" in k or "GOOGLE" in k or "JWT" in k or "CORS" in k}
    }


# Only include routers if environment variables are set
try:
    logger.info("Attempting to import API routers...")
    from app.api import auth, records
    from app.core.config import settings
    
    logger.info("Successfully imported API routers")
    
    # Include routers
    app.include_router(auth.router, prefix="/api/v1")
    app.include_router(records.router, prefix="/api/v1")
    
    logger.info("Successfully included API routers")
    
    @app.get("/debug")
    async def debug_env():
        """Debug environment variables"""
        return {
            "supabase_url": settings.supabase_url,
            "google_client_id": settings.google_client_id,
            "google_redirect_uri": settings.google_redirect_uri,
            "cors_origins": settings.cors_origins,
            "upload_dir": settings.upload_dir,
            "has_supabase_key": bool(settings.supabase_key),
            "has_jwt_secret": bool(settings.jwt_secret_key)
        }
        
except Exception as e:
    logger.error(f"Error loading API routers: {e}")
    logger.error(f"Error type: {type(e)}")
    import traceback
    logger.error(f"Traceback: {traceback.format_exc()}")
    
    @app.get("/debug")
    async def debug_env():
        """Debug environment variables - Error loading settings"""
        return {
            "error": str(e),
            "error_type": str(type(e)),
            "message": "Settings failed to load - check environment variables"
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
