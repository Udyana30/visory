import authService from '@/services/authService';
import apiClient from '@/lib/apiClient';
import { cookies } from '@/lib/cookies';

// Mock dependensi eksternal agar tidak melakukan request jaringan asli
jest.mock('@/lib/apiClient');
jest.mock('@/lib/cookies');

// Mock localStorage (Browser API)
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
    removeItem: jest.fn((key) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; })
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('White Box - Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  // [SKENARIO PATH 3]: Login Berhasil
  // Memastikan data dikirim ke endpoint yang benar dan token disimpan
  it('login() memanggil API dan menyimpan token ke cookies & user ke localStorage', async () => {
    const mockResponse = {
      data: {
        access_token: 'fake-jwt-token',
        user: { id: 1, email: 'test@example.com' }
      }
    };
    (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

    const credentials = { email: 'test@example.com', password: 'password123' };
    await authService.login(credentials);

    // 1. Cek Endpoint
    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', credentials);
    
    // 2. Cek Hasil yang Diharapkan (Simpan Token)
    expect(cookies.set).toHaveBeenCalledWith('access_token', 'fake-jwt-token', 7);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockResponse.data.user));
  });

  // [SKENARIO PATH 2]: Login Gagal
  // Memastikan error dilempar dan tidak ada penyimpanan token
  it('login() melempar error saat API gagal dan tidak menyimpan token', async () => {
    const mockError = new Error('Invalid credentials');
    (apiClient.post as jest.Mock).mockRejectedValue(mockError);

    await expect(authService.login({ email: 'wrong', password: 'wrong' }))
      .rejects.toThrow('Invalid credentials');
    
    // Pastikan cookies tidak dipanggil
    expect(cookies.set).not.toHaveBeenCalled();
  });
});