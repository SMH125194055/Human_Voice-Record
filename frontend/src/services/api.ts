import axios, { AxiosInstance } from 'axios';
import { User, Record, CreateRecordRequest, UpdateRecordRequest } from '../types';

// Simple API URL based on environment
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://hvr-huzaifa-backend-oezgnww8w-huzaifas-projects-044fb73a.vercel.app/api/v1'
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1');

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async getGoogleAuthUrl(): Promise<{ auth_url: string }> {
    const response = await this.api.get('/auth/google');
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.api.get('/auth/me');
    return response.data;
  }

  // Records endpoints
  async getRecords(): Promise<Record[]> {
    const response = await this.api.get('/records/');
    return response.data;
  }

  async getRecord(id: string): Promise<Record> {
    const response = await this.api.get(`/records/${id}`);
    return response.data;
  }

  async createRecord(record: CreateRecordRequest): Promise<Record> {
    const response = await this.api.post('/records/', record);
    return response.data;
  }

  async updateRecord(id: string, record: UpdateRecordRequest): Promise<Record> {
    const response = await this.api.put(`/records/${id}`, record);
    return response.data;
  }

  async deleteRecord(id: string): Promise<{ message: string }> {
    const response = await this.api.delete(`/records/${id}`);
    return response.data;
  }

  async uploadAudio(recordId: string, audioFile: File): Promise<{ message: string; file_path: string; record: Record }> {
    const formData = new FormData();
    formData.append('audio_file', audioFile);

    const response = await this.api.post(`/records/${recordId}/upload-audio`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getAudioFile(recordId: string): Promise<{ audio_file_path: string }> {
    const response = await this.api.get(`/records/${recordId}/audio`);
    return response.data;
  }
}

export const apiService = new ApiService();
