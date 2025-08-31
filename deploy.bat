@echo off
chcp 65001 >nul
echo 🚀 Starting Complete Deployment Process...

:: Check if we're on main branch
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
if not "%CURRENT_BRANCH%"=="main" (
    echo ⚠️  You're on branch: %CURRENT_BRANCH%
    set /p SWITCH_BRANCH="Do you want to switch to main branch? (y/n): "
    if /i "%SWITCH_BRANCH%"=="y" (
        git checkout main
        echo ✅ Switched to main branch
    ) else (
        echo ❌ Deployment cancelled. Please switch to main branch manually.
        pause
        exit /b 1
    )
)

:: Pull latest changes
echo 📥 Pulling latest changes from main branch...
git pull origin main

:: Deploy Backend
echo 🔧 Deploying Backend...
cd backend
vercel --prod --yes
if %ERRORLEVEL% EQU 0 (
    echo ✅ Backend deployed successfully!
) else (
    echo ❌ Backend deployment failed!
    pause
    exit /b 1
)
cd ..

:: Deploy Frontend
echo 🎨 Deploying Frontend...
cd frontend
vercel --prod --yes
if %ERRORLEVEL% EQU 0 (
    echo ✅ Frontend deployed successfully!
) else (
    echo ❌ Frontend deployment failed!
    pause
    exit /b 1
)
cd ..

echo 🎉 Complete deployment finished!
echo 📱 Your application is now live!
echo 🌐 Frontend: https://hvr-huzaifa-frontend.vercel.app
echo 🔧 Backend: https://hvr-huzaifa-backend.vercel.app
pause
