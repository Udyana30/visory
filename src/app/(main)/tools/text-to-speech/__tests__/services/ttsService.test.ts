import { ttsService } from '@/services/ttsService';
import apiClient from '@/lib/apiClient';

// Mocking Axios Client
jest.mock('@/lib/apiClient', () => ({
  post: jest.fn(),
  get: jest.fn(),
  delete: jest.fn(),
}));

describe('White Box Testing - TTS Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Step 1: Create TTS (Path API)
  it('1. createTTS calls correct endpoint with payload', async () => {
    const payload = { 
      title: 'Test', 
      input_text: 'Hi', 
      voice_name: 'Ardi', 
      rate: '0%', 
      volume: '0%', 
      pitch: '0Hz' 
    };
    
    const mockResponse = { data: { id: 1, title: 'Test' } };
    (apiClient.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await ttsService.createTTS(payload);

    // Verifikasi endpoint dan payload
    expect(apiClient.post).toHaveBeenCalledWith('/service/tts/create', payload);
    expect(result).toEqual(mockResponse.data);
  });

  // Step 2: Get History (Query Params)
  it('2. getTTS constructs query parameters correctly', async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: [] });

    await ttsService.getTTS({ page: 2, limit: 20 });

    // Verifikasi query string terbentuk benar
    expect(apiClient.get).toHaveBeenCalledWith(
      expect.stringContaining('page=2&limit=20')
    );
  });
});