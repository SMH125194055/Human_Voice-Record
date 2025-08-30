-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    picture TEXT,
    google_id VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create records table
CREATE TABLE IF NOT EXISTS records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    script TEXT NOT NULL,
    description TEXT,
    audio_file_path TEXT,
    duration FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_records_user_id ON records(user_id);
CREATE INDEX IF NOT EXISTS idx_records_created_at ON records(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Create RLS policies for records table
CREATE POLICY "Users can view their own records" ON records
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own records" ON records
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own records" ON records
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own records" ON records
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_records_updated_at BEFORE UPDATE ON records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Storage bucket setup (run this in Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES (
--     'audio-recordings',
--     'audio-recordings',
--     true,
--     52428800, -- 50MB
--     ARRAY['audio/*']
-- );

-- Storage policies for audio recordings
-- CREATE POLICY "Users can upload their own audio files" ON storage.objects
--     FOR INSERT WITH CHECK (
--         bucket_id = 'audio-recordings' AND
--         (storage.foldername(name))[1] = 'users' AND
--         (storage.foldername(name))[2] = auth.uid()::text
--     );

-- CREATE POLICY "Users can view their own audio files" ON storage.objects
--     FOR SELECT USING (
--         bucket_id = 'audio-recordings' AND
--         (storage.foldername(name))[1] = 'users' AND
--         (storage.foldername(name))[2] = auth.uid()::text
--     );

-- CREATE POLICY "Users can update their own audio files" ON storage.objects
--     FOR UPDATE USING (
--         bucket_id = 'audio-recordings' AND
--         (storage.foldername(name))[1] = 'users' AND
--         (storage.foldername(name))[2] = auth.uid()::text
--     );

-- CREATE POLICY "Users can delete their own audio files" ON storage.objects
--     FOR DELETE USING (
--         bucket_id = 'audio-recordings' AND
--         (storage.foldername(name))[1] = 'users' AND
--         (storage.foldername(name))[2] = auth.uid()::text
--     );
