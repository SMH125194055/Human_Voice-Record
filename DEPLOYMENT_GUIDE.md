# 🚀 Vercel Deployment Guide

## 📋 **Prerequisites**

### **1. GitHub Repository Setup**
```bash
# Create a new branch for deployment
git checkout -b deployment-setup

# Add all files
git add .

# Commit changes
git commit -m "Add deployment configuration and environment files"

# Push to GitHub
git push origin deployment-setup
```

### **2. Vercel Account Setup**
- Sign up at [vercel.com](https://vercel.com)
- Connect your GitHub account
- Install Vercel CLI: `npm i -g vercel`

## 🔧 **Environment Configuration**

### **Backend Environment Variables (Vercel Dashboard)**

1. **Go to Vercel Dashboard** → Your Backend Project → Settings → Environment Variables
2. **Add these variables:**

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-key-here
JWT_SECRET=your-jwt-secret-here
JWT_ALGORITHM=HS256
JWT_EXPIRATION=24h
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
CORS_ORIGINS=https://your-frontend-app.vercel.app
STORAGE_BUCKET=audio-recordings
STORAGE_REGION=us-east-1
```

### **Frontend Environment Variables (Vercel Dashboard)**

1. **Go to Vercel Dashboard** → Your Frontend Project → Settings → Environment Variables
2. **Add these variables:**

```env
VITE_API_BASE_URL=https://your-backend-app.vercel.app
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
VITE_APP_NAME=Human Voice Record
VITE_APP_VERSION=1.0.0
```

## 🚀 **Deployment Steps**

### **Step 1: Deploy Backend**

```bash
# Navigate to backend directory
cd backend

# Deploy to Vercel
vercel --prod

# Follow the prompts:
# - Set up and deploy: Yes
# - Which scope: Select your account
# - Link to existing project: No
# - Project name: human-voice-record-backend
# - Directory: ./
# - Override settings: No
```

### **Step 2: Deploy Frontend**

```bash
# Navigate to frontend directory
cd ../frontend

# Deploy to Vercel
vercel --prod

# Follow the prompts:
# - Set up and deploy: Yes
# - Which scope: Select your account
# - Link to existing project: No
# - Project name: human-voice-record-frontend
# - Directory: ./
# - Override settings: No
```

### **Step 3: Update Environment Variables**

1. **Get your backend URL** from Vercel dashboard
2. **Update frontend environment variables** with the backend URL
3. **Redeploy frontend** if needed

## 🔄 **Development Workflow**

### **Local Development**
```bash
# Start backend
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

# Start frontend (in new terminal)
cd frontend
npm install
npm run dev
```

### **Production Deployment**
```bash
# Make changes in your feature branch
git checkout -b new-feature
# ... make changes ...
git add .
git commit -m "Add new feature"
git push origin new-feature

# Deploy to production
vercel --prod
```

## 📁 **Project Structure for Deployment**

```
human-voice-record/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── vercel.json
│   ├── env.production
│   └── .env (local only)
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── env.production
│   └── .env (local only)
├── DEPLOYMENT_GUIDE.md
└── README.md
```

## 🔐 **Security Checklist**

- [ ] **Environment variables** are set in Vercel dashboard
- [ ] **CORS origins** are configured for production domains
- [ ] **Google OAuth** redirect URIs are updated
- [ ] **Supabase RLS** policies are configured
- [ ] **JWT secrets** are strong and unique
- [ ] **API keys** are not exposed in client-side code

## 🐛 **Troubleshooting**

### **Common Issues:**

1. **CORS Errors**
   - Check CORS_ORIGINS in backend environment variables
   - Ensure frontend URL is included

2. **Database Connection Issues**
   - Verify Supabase credentials
   - Check DATABASE_URL format

3. **Audio Upload Failures**
   - Verify storage bucket permissions
   - Check SUPABASE_SERVICE_KEY

4. **Google OAuth Issues**
   - Update redirect URIs in Google Console
   - Verify client ID and secret

## 📞 **Support**

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test locally first
4. Check browser console for errors

## 🎯 **Next Steps After Deployment**

1. **Test all features** on production
2. **Set up custom domain** (optional)
3. **Configure analytics** (optional)
4. **Set up monitoring** (optional)
5. **Create backup strategy** for database
