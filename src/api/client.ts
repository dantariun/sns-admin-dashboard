import { STORAGE_KEY_ACCESS_TOKEN } from '@/lib/constants';
import type { ApiResponse } from '@/types/api';
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

export const client = axios.create({
  baseURL: '/api',
  timeout: 10_000,
});

client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(STORAGE_KEY_ACCESS_TOKEN);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    const serverMessage = error.response?.data?.message;
    if (serverMessage) error.message = serverMessage;
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEY_ACCESS_TOKEN);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
