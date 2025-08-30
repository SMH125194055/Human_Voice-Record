# 🔍 **Data Verification Guide**

## ✅ **How to Check if Data is Being Saved**

### **Step 1: Check the Frontend**
1. **Open your browser** and go to http://localhost:3000
2. **Sign in with Google**
3. **Click "New Record"**
4. **Record audio** using the voice recorder
5. **Fill in the form** (title, script, description)
6. **Click "Create Record"**
7. **Check if the record appears** in the main list

### **Step 2: Check the Backend API**
1. **Open your browser** and go to http://localhost:8000/docs
2. **Click "Authorize"** and enter your JWT token
3. **Test the `/api/v1/records` endpoint** to see all records
4. **Test the `/api/v1/auth/me` endpoint** to see your user info

### **Step 3: Check Supabase Database**
1. **Go to your Supabase project**: https://supabase.com/dashboard/project/ihwnekrktttmhbrdoskt/table-editor
2. **Click on the "users" table** to see user data
3. **Click on the "records" table** to see record data
4. **Check if your data appears** in both tables

### **Step 4: Check Supabase Storage**
1. **Go to Storage** in your Supabase dashboard
2. **Click on the "audio-recordings" bucket**
3. **Check if audio files are uploaded** in user-specific folders

## 🔧 **What Should Happen**

### **When you create a record:**
1. ✅ **User is created** in the `users` table (if first time)
2. ✅ **Record is created** in the `records` table
3. ✅ **Audio file is uploaded** to Supabase Storage
4. ✅ **Record appears** in the frontend list
5. ✅ **Success message** shows "Record created successfully with audio!"

### **When you delete a record:**
1. ✅ **Record is deleted** from the `records` table
2. ✅ **Audio file is deleted** from Supabase Storage
3. ✅ **Record disappears** from the frontend list
4. ✅ **Success message** shows "Record deleted successfully!"

## 🚨 **Common Issues & Solutions**

### **Issue: Records saved without audio**
- **Solution**: The new flow requires audio recording before saving
- **Check**: Make sure you record audio before clicking "Create Record"

### **Issue: Audio not uploading**
- **Solution**: Check if the storage bucket exists and has proper permissions
- **Check**: Verify the `audio-recordings` bucket is created in Supabase

### **Issue: Records not appearing**
- **Solution**: Check the browser console for errors
- **Check**: Verify the backend is running on http://localhost:8000

### **Issue: Authentication errors**
- **Solution**: Check if the JWT token is valid
- **Check**: Try signing out and signing back in

## 📊 **Expected Data Structure**

### **Users Table:**
```sql
id: UUID (auto-generated)
email: VARCHAR (from Google)
name: VARCHAR (from Google)
picture: TEXT (from Google)
google_id: VARCHAR (from Google)
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

### **Records Table:**
```sql
id: UUID (auto-generated)
user_id: UUID (references users.id)
title: VARCHAR
script: TEXT
description: TEXT
audio_file_path: TEXT (URL to Supabase Storage)
duration: FLOAT (audio duration in seconds)
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

### **Storage Structure:**
```
audio-recordings/
├── users/
│   └── {user_id}/
│       └── records/
│           └── {record_id}/
│               └── recording_{uuid}.wav
```

## 🎯 **Test the Complete Flow**

1. **Create a new record** with audio
2. **Edit the record** and add new audio
3. **Delete the record**
4. **Check all data** is properly saved/deleted in Supabase

**This will verify that your Human Record application is working correctly!** 🚀

