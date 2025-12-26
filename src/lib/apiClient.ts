import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { cookies } from './cookies';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const createAxiosInstance = (baseURL?: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 60000,
  });

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (typeof window !== 'undefined') {
        const token = cookies.get('access_token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401 && typeof window !== 'undefined') {
        cookies.remove('access_token');
        window.location.href = '/login';
      }
      return Promise.reject(error.response?.data || error.message);
    }
  );

  return instance;
};

const apiClient = createAxiosInstance(BASE_URL);
const avatarApiClient = createAxiosInstance('/api/avatar');

export { apiClient, avatarApiClient };
export default apiClient;