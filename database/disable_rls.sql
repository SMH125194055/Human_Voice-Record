-- Disable Row Level Security on existing tables
-- Run this if you already have RLS enabled and want to disable it

-- Disable RLS on users table
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Disable RLS on records table  
ALTER TABLE records DISABLE ROW LEVEL SECURITY;

-- Drop existing RLS policies (if any)
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can view their own records" ON records;
DROP POLICY IF EXISTS "Users can insert their own records" ON records;
DROP POLICY IF EXISTS "Users can update their own records" ON records;
DROP POLICY IF EXISTS "Users can delete their own records" ON records;

-- Note: After running this, the application will handle authorization at the API level
-- using JWT tokens instead of database-level RLS policies

