import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { cookies } from './cookies';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const isDevelopment = process.env.NODE_ENV === 'development';

const commonConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
  maxRedirects: 5,
  validateStatus: (status: number) => {
    return (status >= 200 && status < 300) || status === 307;
  },
};

const handleRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  if (typeof window !== 'undefined') {
    const token = cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  if (isDevelopment) {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data instanceof FormData ? 'FormData' : config.data,
      params: config.params,
    });
  }

  return config;
};

const handleRequestError = (error: AxiosError): Promise<never> => {
  if (isDevelopment) {
    console.error('❌ Request Setup Error:', error.message);
  }
  return Promise.reject(error);
};

const handleResponse = (response: AxiosResponse) => response;

const handleResponseError = (error: AxiosError): Promise<never> => {
  if (error.response) {
    const { status, data } = error.response;

    if ((status === 401 || status === 403) && typeof window !== 'undefined') {
      cookies.remove('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(new Error('Session expired. Please login again.'));
    }

    if (isDevelopment) {
      console.error('❌ API Error Response:', {
        status,
        url: error.config?.url,
        data,
      });
    }

    const errorMessage = 
      (data as any)?.message || 
      (data as any)?.detail || 
      `Request failed with status ${status}`;

    const enhancedError = new Error(errorMessage);
    (enhancedError as any).status = status;
    (enhancedError as any).data = data;
    
    return Promise.reject(enhancedError);

  } else if (error.request) {
    if (isDevelopment) {
      console.error('❌ Network Error - No Response:', error.message);
    }
    return Promise.reject(new Error('Network error. Check your connection or Proxy.'));
  }

  return Promise.reject(error);
};

const applyInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use(handleRequest, handleRequestError);
  instance.interceptors.response.use(handleResponse, handleResponseError);
};

const apiClient: AxiosInstance = axios.create({
  ...commonConfig,
  baseURL: BASE_URL,
});

export const avatarApiClient: AxiosInstance = axios.create({
  ...commonConfig,
  baseURL: '/api/avatar', 
});

applyInterceptors(apiClient);
applyInterceptors(avatarApiClient);

export default apiClient;