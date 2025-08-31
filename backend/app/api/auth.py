from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import RedirectResponse
from app.core.auth import create_access_token, verify_google_token, get_current_user
from app.services.user_service import user_service
from app.models.user import UserCreate, User
from app.core.config import settings
import httpx
import os
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.get("/google")
async def google_auth():
    """Initiate Google OAuth flow"""
    # Use different redirect URIs based on environment
    if os.getenv("VERCEL"):
        # Production - use consistent URL
        redirect_uri = "https://hvr-huzaifa-backend.vercel.app/api/v1/auth/google/callback"
    else:
        # Development - use localhost
        redirect_uri = "http://localhost:8000/api/v1/auth/google/callback"
    
    google_auth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={settings.google_client_id}&"
        f"redirect_uri={redirect_uri}&"
        f"response_type=code&"
        f"scope=openid email profile&"
        f"access_type=offline"
    )
    logger.info(f"Generated auth URL with redirect_uri: {redirect_uri}")
    return {"auth_url": google_auth_url}


@router.get("/google/callback")
async def google_callback(code: str):
    """Handle Google OAuth callback"""
    try:
        # Use the same redirect URI logic as the auth request
        if os.getenv("VERCEL"):
            # Production - use consistent URL
            redirect_uri = "https://hvr-huzaifa-backend.vercel.app/api/v1/auth/google/callback"
        else:
            # Development - use localhost
            redirect_uri = "http://localhost:8000/api/v1/auth/google/callback"
        
        # Exchange code for tokens
        token_url = "https://oauth2.googleapis.com/token"
        token_data = {
            "client_id": settings.google_client_id,
            "client_secret": settings.google_client_secret,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": redirect_uri,
        }
        
        async with httpx.AsyncClient() as client:
            token_response = await client.post(token_url, data=token_data)
            token_response.raise_for_status()
            tokens = token_response.json()
        
        # Get user info from Google
        user_info_url = "https://www.googleapis.com/oauth2/v2/userinfo"
        headers = {"Authorization": f"Bearer {tokens['access_token']}"}
        
        async with httpx.AsyncClient() as client:
            user_response = await client.get(user_info_url, headers=headers)
            user_response.raise_for_status()
            google_user = user_response.json()
        
        # Check if user exists
        user = await user_service.get_user_by_google_id(google_user["id"])
        
        if not user:
            # Create new user
            user_data = UserCreate(
                email=google_user["email"],
                name=google_user["name"],
                picture=google_user.get("picture"),
                google_id=google_user["id"]
            )
            user = await user_service.create_user(user_data)
        
        # Create access token
        access_token = create_access_token(data={"sub": user.id})
        
        # Redirect to frontend with token - use production URL for Vercel, localhost for development
        if os.getenv("VERCEL"):
            frontend_url = "https://hvr-huzaifa-frontend.vercel.app/auth/callback"
        else:
            frontend_url = "http://localhost:3000/auth/callback"
        return RedirectResponse(url=f"{frontend_url}?token={access_token}")
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Authentication failed: {str(e)}"
        )


@router.get("/me", response_model=User)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return current_user
