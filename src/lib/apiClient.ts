import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { cookies } from './cookies';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const isDevelopment = process.env.NODE_ENV === 'development';

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
  maxRedirects: 5,
  validateStatus: (status) => {
    return (status >= 200 && status < 300) || status === 307;
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
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
  },
  (error: AxiosError): Promise<never> => {
    if (isDevelopment) {
      console.error('❌ Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError): Promise<never> => {
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
          statusText: error.response.statusText,
          url: error.config?.url,
          method: error.config?.method?.toUpperCase(),
          requestData: error.config?.data instanceof FormData 
            ? 'FormData (check Network tab)' 
            : error.config?.data,
          responseData: data,
        });

        if (status === 422) {
          console.error('🔍 Validation Error:', {
            detail: (data as any)?.detail,
            errors: (data as any)?.errors,
          });
        }
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
        console.error('❌ Network Error - No Response:', {
          url: error.config?.url,
          method: error.config?.method?.toUpperCase(),
          message: error.message,
          code: error.code,
        });
      }

      const networkError = new Error(
        error.code === 'ECONNABORTED'
          ? 'Request timeout. Please try again.'
          : error.code === 'ERR_NETWORK'
          ? 'Network error. Please check your connection or backend server.'
          : 'Failed to connect to server.'
      );
      (networkError as any).code = error.code;
      
      return Promise.reject(networkError);

    } else {
      if (isDevelopment) {
        console.error('❌ Request Error:', error.message);
      }
      return Promise.reject(error);
    }
  }
);

export default apiClient;