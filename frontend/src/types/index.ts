export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  google_id: string;
  created_at: string;
  updated_at: string;
}

export interface Record {
  id: string;
  user_id: string;
  title: string;
  script: string;
  description?: string;
  audio_file_path?: string;
  duration?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateRecordRequest {
  title: string;
  script: string;
  description?: string;
}

export interface UpdateRecordRequest {
  title?: string;
  script?: string;
  description?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

