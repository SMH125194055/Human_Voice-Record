# 🚀 Human Record - Local Setup Guide

## 📋 Prerequisites Check ✅

You have successfully installed:
- ✅ Python 3.13.7
- ✅ Node.js v22.18.0
- ✅ npm v10.9.3

## 🔧 Current Status

### ✅ Completed:
- ✅ Backend dependencies installed
- ✅ Frontend dependencies installed
- ✅ Virtual environment created
- ✅ Basic .env file created
- ✅ JWT secret generated
- ✅ Startup scripts created

### ❌ Still Needed:
- ❌ Supabase credentials
- ❌ Google OAuth credentials

## 📝 Step-by-Step Setup

### Step 1: Complete Supabase Setup

1. **Go to your Supabase project**: https://supabase.com/dashboard/project/ihwnekrktttmhbrdoskt/settings/api-keys

2. **Set up the database**:
   - Go to **SQL Editor** in your Supabase dashboard
   - Copy and paste the entire content from `database/schema.sql`
   - Click **Run** to execute

3. **Create Storage Bucket**:
   - Go to **Storage** in your Supabase dashboard
   - Click **Create a new bucket**
   - Set:
     - **Name**: `audio-recordings`
     - **Public bucket**: ✅ Check this
     - **File size limit**: `52428800` (50MB)
     - **Allowed MIME types**: `audio/*`
   - Click **Create bucket**

4. **Set up Storage Policies**:
   - In the Storage section, click on the `audio-recordings` bucket
   - Go to **Policies** tab
   - Add these policies:

   **For INSERT:**
   ```sql
   (bucket_id = 'audio-recordings' AND (storage.foldername(name))[1] = 'users' AND (storage.foldername(name))[2] = auth.uid()::text)
   ```

   **For SELECT:**
   ```sql
   (bucket_id = 'audio-recordings' AND (storage.foldername(name))[1] = 'users' AND (storage.foldername(name))[2] = auth.uid()::text)
   ```

   **For UPDATE:**
   ```sql
   (bucket_id = 'audio-recordings' AND (storage.foldername(name))[1] = 'users' AND (storage.foldername(name))[2] = auth.uid()::text)
   ```

   **For DELETE:**
   ```sql
   (bucket_id = 'audio-recordings' AND (storage.foldername(name))[1] = 'users' AND (storage.foldername(name))[2] = auth.uid()::text)
   ```

5. **Get your API keys**:
   - Copy the **anon public key**
   - Copy the **service role key**

### Step 2: Set Up Google OAuth

1. **Go to Google Cloud Console**: https://console.cloud.google.com/apis/credentials

2. **Create a project** (if you don't have one)

3. **Enable Google+ API**:
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API" and enable it

4. **Create OAuth credentials**:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth 2.0 Client IDs**
   - Choose **Web application**
   - Add **Authorized redirect URIs**:
     - `http://localhost:8000/api/v1/auth/google/callback`
   - Click **Create**
   - Copy the **Client ID** and **Client Secret**

### Step 3: Update Environment Variables

1. **Edit the `.env` file** in the `backend` folder
2. **Replace these placeholder values**:

```env
# Replace these in backend/.env
SUPABASE_KEY=your_actual_anon_public_key_here
SUPABASE_SERVICE_KEY=your_actual_service_role_key_here
GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here
```

### Step 4: Start the Application

#### Option A: Using the provided scripts (Recommended)

1. **Start Backend**:
   ```bash
   cd backend
   start_backend.bat
   ```

2. **Start Frontend** (in a new terminal):
   ```bash
   cd frontend
   start_frontend.bat
   ```

#### Option B: Manual startup

1. **Start Backend**:
   ```bash
   cd backend
   venv\Scripts\activate
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Start Frontend** (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

## 🌐 Access the Application

Once both servers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🧪 Test the Application

1. **Open** http://localhost:3000 in your browser
2. **Click** "Sign in with Google"
3. **Complete** the OAuth flow
4. **Create** a new record with script
5. **Record** audio using the voice recorder
6. **Test** all CRUD operations

## 🔧 Troubleshooting

### Common Issues:

1. **Environment variables not configured**:
   - Make sure you've updated the `.env` file with real credentials
   - Run `python update_env.py` to check what's missing

2. **Supabase connection issues**:
   - Verify your Supabase URL and keys
   - Check that the database schema is set up
   - Ensure storage bucket and policies are configured

3. **Google OAuth errors**:
   - Verify redirect URIs are correct
   - Check that Google+ API is enabled
   - Ensure credentials are properly configured

4. **Port already in use**:
   - Change ports in the startup commands
   - Kill existing processes using those ports

### Getting Help:

- Check the browser console for frontend errors
- Check the terminal for backend errors
- Review the API documentation at http://localhost:8000/docs

## 🎉 Success!

Once everything is working, you'll have:
- ✅ Full-stack voice recording application
- ✅ Google OAuth authentication
- ✅ Supabase database and storage
- ✅ Responsive design
- ✅ CRUD operations for records
- ✅ Audio file management

Happy coding! 🚀

