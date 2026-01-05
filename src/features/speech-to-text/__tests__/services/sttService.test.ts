import { sttService } from '@/services/sttService';
import apiClient from '@/lib/apiClient';

// Mock apiClient
jest.mock('@/lib/apiClient', () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
}));

describe('White Box - STT Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test Create (Upload)
  it('1. createSTT sends correct FormData to endpoint', async () => {
    const mockResponse = { data: { message: 'Success', data: { id: 1 } } };
    (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

    const formData = new FormData();
    formData.append('title', 'Test');
    formData.append('language', 'id');

    const result = await sttService.createSTT(formData);

    // White Box Check: Verifikasi endpoint dan headers multipart
    expect(apiClient.post).toHaveBeenCalledWith(
      '/service/stt/create',
      formData,
      expect.objectContaining({
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    );
    expect(result).toEqual(mockResponse.data);
  });

  // Test Get History
  it('2. getSTT constructs query params correctly', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });

    await sttService.getSTT({ page: 2, limit: 10 });

    expect(apiClient.get).toHaveBeenCalledWith(
      expect.stringContaining('page=2&limit=10')
    );
  });
});