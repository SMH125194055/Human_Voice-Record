-- Fix storage bucket RLS policies
-- This script disables RLS on the storage.objects table for the audio-recordings bucket

-- Disable RLS on storage.objects for audio-recordings bucket
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Or alternatively, create a policy that allows all operations for the audio-recordings bucket
-- CREATE POLICY "Allow all operations for audio-recordings bucket" ON storage.objects
--     FOR ALL USING (bucket_id = 'audio-recordings');

-- Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.objects TO anon;

-- Make sure the bucket exists and is public
-- Note: This should be done through the Supabase dashboard or API
-- The bucket should be created with public access enabled
