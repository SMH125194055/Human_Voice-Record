@echo off
echo 🚀 Starting Human Record Backend...
echo.

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Check if .env is configured
findstr "your_anon_public_key_here" .env >nul
if %errorlevel% equ 0 (
    echo ❌ Environment variables not configured!
    echo.
    echo Please update your .env file with:
    echo 1. Supabase credentials from: https://supabase.com/dashboard/project/ihwnekrktttmhbrdoskt/settings/api-keys
    echo 2. Google OAuth credentials from: https://console.cloud.google.com/apis/credentials
    echo.
    pause
    exit /b 1
)

echo ✅ Environment variables configured
echo 🌐 Starting server on http://localhost:8000
echo 📚 API Documentation: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

