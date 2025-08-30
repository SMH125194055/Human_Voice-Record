
@echo off
echo 🚀 Starting Human Record Application...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed!

REM Start backend
echo 🔧 Setting up backend...
cd backend

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔌 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📥 Installing Python dependencies...
pip install -r requirements.txt

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  Warning: .env file not found in backend directory.
    echo    Please create .env file with your configuration (see setup.md)
    echo    Continuing without environment variables...
)

REM Start backend server
echo 🚀 Starting backend server on http://localhost:8000
start "Backend Server" cmd /k "uvicorn main:app --reload --host 0.0.0.0 --port 8000"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo 🔧 Setting up frontend...
cd ..\frontend

REM Install dependencies
echo 📥 Installing Node.js dependencies...
npm install

REM Check if .env file exists
if not exist ".env" (
    echo 📝 Creating frontend .env file...
    echo VITE_API_URL=http://localhost:8000/api/v1 > .env
)

REM Start frontend server
echo 🚀 Starting frontend server on http://localhost:3000
start "Frontend Server" cmd /k "npm run dev"

echo.
echo 🎉 Human Record Application is starting!
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8000
echo 📚 API Documentation: http://localhost:8000/docs
echo.
echo Both servers are now running in separate windows.
echo Close the windows to stop the servers.
pause

