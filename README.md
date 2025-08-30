# Human Record Web Application

A full-stack web application for recording human voice with script input, built with FastAPI, Supabase, and React.

## Features

- 🔐 Gmail OAuth Authentication
- 📝 Script input and management
- 🎤 Voice recording capabilities
- 👤 User management (add/remove records)
- 🗄️ Supabase database integration
- ☁️ Supabase Storage for audio files
- 📱 Fully responsive design
- 🌐 Deployable to Vercel

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Supabase** - PostgreSQL database with real-time features
- **Supabase Storage** - Cloud storage for audio files
- **Python 3.8+** - Backend runtime

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Responsive styling
- **Vite** - Build tool

## Project Structure

```
human-record/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── services/
│   │   └── storage_service.py
│   ├── requirements.txt
│   └── main.py
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   ├── package.json
│   └── vite.config.ts
├── database/
│   └── schema.sql
└── README.md
```

## Key Features

### 🎤 Voice Recording
- Real-time audio recording with microphone access
- Play/pause/stop controls with visual feedback
- Audio file upload to Supabase Storage
- Duration tracking and display
- Download functionality

### 📝 Script Management
- Create records with title, script, and description
- Edit existing records with form validation
- Preview script content with truncation
- Rich text input with responsive design

### 🔐 Authentication
- Google OAuth integration
- JWT token management
- Protected routes and API endpoints
- User session management
- Secure logout functionality

### 🗄️ Database & Storage
- PostgreSQL with Supabase
- Row Level Security (RLS) policies
- User-specific storage folders
- Audio file organization by user ID
- Proper indexing and constraints

### 📱 Responsive Design
- **Mobile-First**: Optimized for 320px+ screens
- **Tablet Support**: Enhanced layout for 768px+ screens
- **Desktop Experience**: Full layout for 1024px+ screens
- **Touch-Friendly**: Optimized for touch interactions
- **Accessibility**: Focus states and keyboard navigation

### 🎨 Modern UI
- Clean, modern design with Tailwind CSS
- Smooth animations and transitions
- Loading states and error handling
- Toast notifications
- Responsive grid layouts

## Development Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- Supabase account
- Google OAuth credentials

### Local Development

1. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Environment Variables**
   - Copy `.env.example` to `.env`
   - Configure Supabase and Google OAuth credentials

## Storage Architecture

### Supabase Storage Bucket
- **Bucket Name**: `audio-recordings`
- **Organization**: `users/{user_id}/records/{record_id}/`
- **File Types**: Audio files only (`audio/*`)
- **Size Limit**: 50MB per file
- **Security**: Row Level Security (RLS) policies

### File Structure
```
audio-recordings/
├── users/
│   ├── {user_id_1}/
│   │   └── records/
│   │       ├── {record_id_1}/
│   │       │   └── recording_abc123.wav
│   │       └── {record_id_2}/
│   │           └── recording_def456.wav
│   └── {user_id_2}/
│       └── records/
│           └── {record_id_3}/
│               └── recording_ghi789.wav
```

## Responsive Design

### Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Responsive Components
- **Voice Recorder**: Stacked layout on mobile, row layout on desktop
- **Record Cards**: Single column on mobile, multi-column on desktop
- **Forms**: Full-width inputs on mobile, compact on desktop
- **Navigation**: Collapsible menu on mobile, horizontal on desktop
- **Audio Player**: Responsive controls and layout

### Mobile Features
- Touch-friendly buttons and controls
- Swipe gestures support
- Mobile navigation menu
- Optimized audio recording interface
- Responsive text sizing

## Deployment

### Vercel Deployment
1. Connect repository to Vercel
2. Configure environment variables
3. Deploy frontend and backend separately

### Environment Variables
- **Backend**: Supabase credentials, Google OAuth, JWT secret
- **Frontend**: API URL for production

## Security

- Row Level Security (RLS) for database access
- User-specific storage folders
- JWT token authentication
- CORS configuration
- File type validation
- Secure file uploads

## Performance

- Lazy loading of components
- Optimized bundle size
- Efficient database queries
- CDN delivery for audio files
- Responsive image loading

## License

MIT
