import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider } from '@/context/AuthContext'; // Import Provider dari Context
import { useAuth } from '@/hooks/useAuth'; // Import Hook dari folder hooks global
import authService from '@/services/authService'; // Import Service

// Mock Router karena AuthContext menggunakan useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock authService (Default Export)
jest.mock('@/services/authService');

// Wrapper Component untuk menyediakan Context
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('White Box - useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset localStorage mock jika perlu
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  // Test Case 1: Login Sukses
  it('login() harus update state user saat sukses', async () => {
    const mockUser = { id: 1, email: 'test@test.com', name: 'Test User' };
    
    // Mock implementasi login di service
    (authService.login as jest.Mock).mockResolvedValue({ 
      user: mockUser, 
      access_token: 'fake-token' 
    });

    // Render Hook dengan Wrapper Provider
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Panggil fungsi login
    await act(async () => {
      const res = await result.current.login({ email: 'test', password: '123' }, false);
      expect(res.success).toBe(true);
    });

    // Verifikasi State
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.error).toBeNull();
  });

  // Test Case 2: Login Gagal
  it('login() harus set error state saat gagal', async () => {
    // Mock implementasi login gagal (Throw error sesuai axios interceptor Anda)
    (authService.login as jest.Mock).mockRejectedValue({ 
      response: { data: { message: 'Wrong password' } } 
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Panggil fungsi login
    await act(async () => {
      const res = await result.current.login({ email: 'test', password: '123' }, false);
      expect(res.success).toBe(false);
    });

    // Verifikasi State
    expect(result.current.user).toBeNull();
    // Pesan error diambil dari catch block di AuthContext
    expect(result.current.error).toBe('Wrong password');
  });
});