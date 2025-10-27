import apiClient from '../lib/apiClient';
import {
  LoginCredentials,
  RegisterData,
  LoginResponse,
  RegisterResponse,
  User,
} from '../types/auth';

const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);

    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }

    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  },

  register: async (userData: RegisterData): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/auth/register', userData);

    if (response.data.token) {
      localStorage.setItem('access_token', response.data.token);
    }

    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch {
        return null;
      }
    }
    return null;
  },

  getToken: (): string | null => {
    return localStorage.getItem('access_token');
  },

  isAuthenticated: (): boolean => {
    return !!authService.getToken();
  },
};

export default authService;
