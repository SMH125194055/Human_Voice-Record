# 🚀 Automated Deployment System

## Overview
This system provides 1-click deployment for both frontend and backend with fixed URLs to avoid URL change issues.

## 📁 Files Created

### 1. `deploy.sh` (Linux/Mac)
- Complete deployment script for both frontend and backend
- Automatic branch checking and switching
- Colored output for better visibility

### 2. `deploy.bat` (Windows)
- Windows batch script for one-click deployment
- Same functionality as deploy.sh but for Windows

### 3. `dev-workflow.sh` (Development Workflow)
- Interactive menu for development workflow
- Feature branch creation and management
- Merge and deployment options

## 🎯 How to Use

### **One-Click Deployment (Production)**
```bash
# Linux/Mac
./deploy.sh

# Windows
deploy.bat
```

### **Development Workflow**
```bash
./dev-workflow.sh
```

## 🔄 Development Workflow

### **1. Create New Feature**
```bash
./dev-workflow.sh
# Choose option 1: Create new feature branch
```

### **2. Develop Your Feature**
- Make changes in your feature branch
- Test locally

### **3. Merge to Development**
```bash
./dev-workflow.sh
# Choose option 2: Merge feature to development
```

### **4. Deploy Development**
```bash
./dev-workflow.sh
# Choose option 3: Deploy from development
```

### **5. Merge to Production**
```bash
./dev-workflow.sh
# Choose option 4: Merge development to main and deploy
```

## 🌐 Fixed URLs

### **Production URLs (Never Change)**
- **Frontend**: `https://hvr-huzaifa-frontend.vercel.app`
- **Backend**: `https://hvr-huzaifa-backend.vercel.app`

### **Google OAuth Redirect URI**
```
https://hvr-huzaifa-backend.vercel.app/api/v1/auth/google/callback
```

## ✅ Benefits

1. **No More URL Changes**: Fixed URLs prevent OAuth and API connection issues
2. **1-Click Deployment**: Complete deployment with single command
3. **Automated Workflow**: Streamlined development process
4. **Error Handling**: Proper error checking and reporting
5. **Cross-Platform**: Works on Windows, Mac, and Linux

## 🛠️ Setup Instructions

### **1. Make Scripts Executable (Linux/Mac)**
```bash
chmod +x deploy.sh
chmod +x dev-workflow.sh
```

### **2. Ensure Vercel CLI is Installed**
```bash
npm install -g vercel
```

### **3. Login to Vercel**
```bash
vercel login
```

## 📋 Usage Examples

### **Quick Development Deploy**
```bash
./dev-workflow.sh
# Choose option 5: Quick deploy
```

### **Full Production Deploy**
```bash
./deploy.sh
```

### **Feature Development**
```bash
./dev-workflow.sh
# Choose option 1: Create feature branch
# Develop your feature
# Choose option 2: Merge to development
# Choose option 3: Deploy development
```

## 🔧 Troubleshooting

### **If deployment fails:**
1. Check if you're on the correct branch
2. Ensure Vercel CLI is logged in
3. Check internet connection
4. Verify environment variables are set

### **If URLs don't work:**
1. URLs are fixed and shouldn't change
2. Check Google Cloud Console for OAuth redirect URI
3. Verify frontend API configuration

## 🎉 Success!

After deployment, your application will be available at:
- **Frontend**: https://hvr-huzaifa-frontend.vercel.app
- **Backend**: https://hvr-huzaifa-backend.vercel.app

No more URL change issues! 🚀
