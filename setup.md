# Human Record - Setup Guide

This guide will help you set up the Human Record application locally and deploy it to Vercel.

## Prerequisites

- Python 3.8+
- Node.js 16+
- Git
- Supabase account
- Google Cloud Console account

## Step 1: Supabase Setup

1. **Create a Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and API keys

2. **Set up the database schema**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the SQL commands from `database/schema.sql`

3. **Set up Storage Bucket**
   - Go to Storage in your Supabase dashboard
   - Create a new bucket called `audio-recordings`
   - Set it as public
   - Set file size limit to 50MB
   - Set allowed MIME types to `audio/*`
   - Enable Row Level Security (RLS)

4. **Configure Storage Policies**
   - In the Storage section, go to Policies
   - Add the following policies for the `audio-recordings` bucket:
   
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

5. **Get your Supabase credentials**
   - Go to Settings > API
   - Copy the following:
     - Project URL
     - Anon public key
     - Service role key (keep this secret)

## Step 2: Google OAuth Setup

1. **Create a Google Cloud project**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing one

2. **Enable Google+ API**
   - Go to APIs & Services > Library
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 credentials**
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:8000/api/v1/auth/google/callback` (for local development)
     - `https://your-domain.vercel.app/api/v1/auth/google/callback` (for production)
   - Note down Client ID and Client Secret

## Step 3: Local Development Setup

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your credentials:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/auth/google/callback
   JWT_SECRET_KEY=your_jwt_secret_key_here
   CORS_ORIGINS=http://localhost:3000,http://localhost:5173
   ```

5. **Run the backend**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   # Create .env file
   echo "VITE_API_URL=http://localhost:8000/api/v1" > .env
   ```

4. **Run the frontend**
   ```bash
   npm run dev
   ```

## Step 4: Testing the Application

1. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

2. **Test the flow**
   - Click "Sign in with Google"
   - Complete OAuth flow
   - Create a new record with script
   - Record audio using the voice recorder
   - Upload audio to the record
   - Test CRUD operations
   - Test responsive design on different screen sizes

## Step 5: Vercel Deployment

### Backend Deployment

1. **Create vercel.json in backend directory**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "main.py",
         "use": "@vercel/python"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "main.py"
       }
     ]
   }
   ```

2. **Deploy to Vercel**
   ```bash
   cd backend
   vercel
   ```

3. **Set environment variables in Vercel**
   - Go to your Vercel project dashboard
   - Navigate to Settings > Environment Variables
   - Add all variables from your `.env` file
   - Update `GOOGLE_REDIRECT_URI` to your Vercel domain

### Frontend Deployment

1. **Update API URL for production**
   ```bash
   # In frontend/.env
   VITE_API_URL=https://your-backend-domain.vercel.app/api/v1
   ```

2. **Deploy to Vercel**
   ```bash
   cd frontend
   vercel
   ```

3. **Update Google OAuth redirect URI**
   - Go to Google Cloud Console
   - Add your frontend domain to authorized redirect URIs

## Responsive Design Features

The application is now fully responsive with the following features:

### Mobile-First Design
- Optimized for mobile devices (320px+)
- Touch-friendly interface
- Swipe gestures support
- Mobile navigation menu

### Tablet Support
- Optimized for tablet screens (768px+)
- Side-by-side layouts
- Improved touch targets

### Desktop Experience
- Full desktop layout (1024px+)
- Multi-column grids
- Hover effects
- Keyboard navigation

### Responsive Components
- **Voice Recorder**: Adapts to screen size with stacked/row layouts
- **Record Cards**: Responsive grid with flexible content
- **Forms**: Full-width on mobile, compact on desktop
- **Navigation**: Collapsible menu on mobile
- **Audio Player**: Responsive controls and layout

### Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

## Troubleshooting

### Common Issues

1. **CORS errors**
   - Ensure CORS_ORIGINS includes your frontend URL
   - Check that backend is running on correct port

2. **Google OAuth errors**
   - Verify redirect URIs are correct
   - Check that Google+ API is enabled
   - Ensure credentials are properly configured

3. **Supabase connection issues**
   - Verify Supabase URL and keys
   - Check that database schema is properly set up
   - Ensure RLS policies are configured

4. **Storage bucket issues**
   - Verify bucket name is `audio-recordings`
   - Check bucket permissions and policies
   - Ensure RLS is enabled on storage

5. **Audio recording issues**
   - Check browser permissions for microphone
   - Ensure HTTPS in production (required for getUserMedia)
   - Test on different browsers

6. **Responsive design issues**
   - Clear browser cache
   - Test on different devices
   - Check CSS media queries

### Environment Variables Checklist

**Backend (.env)**
- [ ] SUPABASE_URL
- [ ] SUPABASE_KEY
- [ ] SUPABASE_SERVICE_KEY
- [ ] GOOGLE_CLIENT_ID
- [ ] GOOGLE_CLIENT_SECRET
- [ ] GOOGLE_REDIRECT_URI
- [ ] JWT_SECRET_KEY
- [ ] CORS_ORIGINS

**Frontend (.env)**
- [ ] VITE_API_URL

## Security Considerations

1. **Never commit sensitive data**
   - Keep `.env` files in `.gitignore`
   - Use environment variables in production

2. **JWT Secret**
   - Use a strong, random secret key
   - Rotate keys periodically

3. **CORS Configuration**
   - Only allow necessary origins
   - Use HTTPS in production

4. **File Uploads**
   - Validate file types
   - Implement file size limits
   - Store files securely in Supabase Storage

5. **Storage Security**
   - Use RLS policies for user isolation
   - Validate file paths and permissions
   - Implement proper cleanup on deletion

## Performance Optimizations

1. **Frontend**
   - Lazy loading of components
   - Optimized bundle size
   - Responsive images
   - Efficient state management

2. **Backend**
   - Async operations
   - Efficient database queries
   - File streaming for uploads
   - Proper error handling

3. **Storage**
   - Compressed audio files
   - Efficient file organization
   - CDN delivery
   - Proper cleanup

## Support

If you encounter issues:
1. Check the troubleshooting section
2. Review the API documentation at `/docs`
3. Check browser console for frontend errors
4. Review backend logs for server errors
5. Test responsive design on different devices
6. Verify storage bucket configuration
