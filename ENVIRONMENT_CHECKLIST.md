# 🔐 Environment Variables Setup Checklist

## 📋 **Local Development (.env files)**

### **Backend (.env)**
```env
# ✅ Copy from your current .env file
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-key-here
JWT_SECRET=your-jwt-secret-here
JWT_ALGORITHM=HS256
JWT_EXPIRATION=24h
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
CORS_ORIGINS=http://localhost:3000
STORAGE_BUCKET=audio-recordings
STORAGE_REGION=us-east-1
```

### **Frontend (.env)**
```env
# ✅ Copy from your current .env file
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
VITE_APP_NAME=Human Voice Record
VITE_APP_VERSION=1.0.0
```

## 🚀 **Production (Vercel Dashboard)**

### **Backend Environment Variables**
- [ ] **SUPABASE_URL** = `https://your-project-id.supabase.co`
- [ ] **SUPABASE_ANON_KEY** = `your-anon-key-here`
- [ ] **SUPABASE_SERVICE_KEY** = `your-service-key-here`
- [ ] **JWT_SECRET** = `your-jwt-secret-here`
- [ ] **JWT_ALGORITHM** = `HS256`
- [ ] **JWT_EXPIRATION** = `24h`
- [ ] **GOOGLE_CLIENT_ID** = `your-google-client-id-here`
- [ ] **GOOGLE_CLIENT_SECRET** = `your-google-client-secret-here`
- [ ] **CORS_ORIGINS** = `https://your-frontend-app.vercel.app`
- [ ] **STORAGE_BUCKET** = `audio-recordings`
- [ ] **STORAGE_REGION** = `us-east-1`

### **Frontend Environment Variables**
- [ ] **VITE_API_BASE_URL** = `https://your-backend-app.vercel.app`
- [ ] **VITE_GOOGLE_CLIENT_ID** = `your-google-client-id-here`
- [ ] **VITE_APP_NAME** = `Human Voice Record`
- [ ] **VITE_APP_VERSION** = `1.0.0`

## 🔧 **Google OAuth Configuration**

### **Google Cloud Console Updates**
1. **Go to Google Cloud Console** → APIs & Services → Credentials
2. **Update OAuth 2.0 Client IDs** with new redirect URIs:
   - [ ] `https://your-frontend-app.vercel.app/auth/callback`
   - [ ] `https://your-backend-app.vercel.app/auth/google/callback`

## 📊 **Supabase Configuration**

### **Supabase Dashboard Updates**
1. **Go to Supabase Dashboard** → Your Project → Settings → API
2. **Copy these values:**
   - [ ] **Project URL** → `SUPABASE_URL`
   - [ ] **anon public** → `SUPABASE_ANON_KEY`
   - [ ] **service_role secret** → `SUPABASE_SERVICE_KEY`

### **Storage Bucket Setup**
1. **Go to Supabase Dashboard** → Storage
2. **Ensure bucket exists:**
   - [ ] **Bucket name:** `audio-recordings`
   - [ ] **Public bucket:** ✅ Enabled
   - [ ] **RLS policies:** ✅ Configured

## 🚀 **Deployment URLs**

### **After First Deployment**
1. **Backend URL:** `https://your-backend-app.vercel.app`
2. **Frontend URL:** `https://your-frontend-app.vercel.app`

### **Update Frontend Environment**
- [ ] **Update VITE_API_BASE_URL** with backend URL
- [ ] **Redeploy frontend** after updating

## 🔍 **Testing Checklist**

### **Local Testing**
- [ ] Backend runs on `http://localhost:8000`
- [ ] Frontend runs on `http://localhost:3000`
- [ ] Google OAuth works locally
- [ ] Audio recording works locally
- [ ] Database operations work locally

### **Production Testing**
- [ ] Backend API responds correctly
- [ ] Frontend loads without errors
- [ ] Google OAuth works in production
- [ ] Audio recording works in production
- [ ] Database operations work in production
- [ ] CORS errors are resolved

## 🐛 **Common Issues & Solutions**

### **CORS Errors**
- [ ] Check `CORS_ORIGINS` includes frontend URL
- [ ] Ensure no trailing slashes in URLs
- [ ] Verify HTTPS vs HTTP consistency

### **Database Connection Issues**
- [ ] Verify Supabase credentials
- [ ] Check DATABASE_URL format
- [ ] Ensure RLS policies are configured

### **Google OAuth Issues**
- [ ] Update redirect URIs in Google Console
- [ ] Verify client ID and secret
- [ ] Check OAuth consent screen settings

### **Audio Upload Issues**
- [ ] Verify storage bucket permissions
- [ ] Check SUPABASE_SERVICE_KEY
- [ ] Ensure bucket exists and is public

## 📞 **Support Resources**

- **Vercel Documentation:** https://vercel.com/docs
- **Supabase Documentation:** https://supabase.com/docs
- **Google OAuth Documentation:** https://developers.google.com/identity/protocols/oauth2
- **FastAPI Documentation:** https://fastapi.tiangolo.com/
- **React Documentation:** https://react.dev/
