import { renderHook, act, waitFor } from '@testing-library/react';
import { useTTS } from '@/hooks/useTTS'; // Sesuaikan path import Anda
import { ttsService } from '@/services/ttsService';

// 1. Mock ttsService sepenuhnya
jest.mock('@/services/ttsService', () => ({
  ttsService: {
    getTTS: jest.fn(),
    createTTS: jest.fn(),
    deleteTTS: jest.fn(),
  },
}));

describe('White Box Testing - useTTS Custom Hook', () => {
  // Reset semua mock sebelum setiap test agar bersih
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // STEP 1: Test Initial State
  it('1. Should initialize with default values (loading false, null data)', () => {
    const { result } = renderHook(() => useTTS());

    // Memastikan state awal bersih
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.results).toBeNull();
    expect(result.current.generatedTTS).toBeNull();
  });

  // STEP 2: Test Fetching Data (Read) - Sukses
  it('2. fetchTTS should update results state on success', async () => {
    // Mock data return dari service
    const mockData = [
      { id: 1, title: 'Audio 1', created_at: '2024-01-01' },
      { id: 2, title: 'Audio 2', created_at: '2024-01-02' }
    ];
    (ttsService.getTTS as jest.Mock).mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useTTS());

    // Panggil fungsi fetch
    await act(async () => {
      await result.current.fetchTTS();
    });

    // Validasi state setelah fetch
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.results).toEqual(mockData);
    expect(ttsService.getTTS).toHaveBeenCalled();
  });

  // STEP 3: Test Fetching Data - Error Handling
  it('3. fetchTTS should handle API errors correctly', async () => {
    // Mock error response struktur Axios
    const mockError = {
      response: {
        data: { message: 'Server Error' }
      }
    };
    (ttsService.getTTS as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useTTS());

    // Expect function to throw (karena di kode asli Anda ada `throw new Error`)
    await act(async () => {
      try {
        await result.current.fetchTTS();
      } catch (e) {
        // Ignored in test execution flow, we check state below
      }
    });

    // Validasi state error terisi
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Server Error');
    expect(result.current.results).toBeNull();
  });

  // STEP 4: Test Generate TTS (Create)
  it('4. generateTTS should update generatedTTS state on success', async () => {
    const mockPayload = { text: 'Hello', voice: 'Ardi' };
    const mockResult = { id: 1, title: 'New Audio', output_speech_url: 'url.mp3' };
    
    (ttsService.createTTS as jest.Mock).mockResolvedValue({ data: mockResult });

    const { result } = renderHook(() => useTTS());

    await act(async () => {
      await result.current.generateTTS(mockPayload as any);
    });

    expect(result.current.generatedTTS).toEqual(mockResult);
    expect(result.current.isLoading).toBe(false);
  });

  // STEP 5: Test Delete TTS (Logic Optimistic Update/Filter)
  it('5. deleteTTS should remove item from results state locally', async () => {
    // A. Setup data awal (simulasi sudah fetch)
    const initialData = [
      { id: 1, title: 'To Delete' },
      { id: 2, title: 'To Keep' }
    ];
    (ttsService.getTTS as jest.Mock).mockResolvedValue({ data: initialData });
    (ttsService.deleteTTS as jest.Mock).mockResolvedValue({}); // Delete sukses

    const { result } = renderHook(() => useTTS());

    // Populate data dulu
    await act(async () => {
      await result.current.fetchTTS();
    });
    
    // Pastikan data ada
    expect(result.current.results).toHaveLength(2);

    // B. Lakukan Delete ID 1
    await act(async () => {
      await result.current.deleteTTS(1);
    });

    // C. White Box Check: Pastikan ID 1 hilang dari state `results`
    // Ini menguji logika: `prev.filter((item) => item.id !== id)`
    expect(ttsService.deleteTTS).toHaveBeenCalledWith(1);
    expect(result.current.results).toHaveLength(1);
    expect(result.current.results?.[0].id).toBe(2);
  });

  // STEP 6: Test Reset Function
  it('6. resetTTS should clear all states to initial values', async () => {
    const { result } = renderHook(() => useTTS());

    // Kotori state (buat seolah-olah ada error atau data)
    await act(async () => {
        // Kita set manual via mock logic fetch
        (ttsService.getTTS as jest.Mock).mockResolvedValue({ data: [{id:1}] });
        await result.current.fetchTTS();
    });
    
    // Pastikan state "kotor"
    expect(result.current.results).not.toBeNull();

    // Panggil Reset
    act(() => {
      result.current.resetTTS();
    });

    // Validasi kembali bersih
    expect(result.current.results).toBeNull();
    expect(result.current.generatedTTS).toBeNull();
    expect(result.current.error).toBeNull();
  });
});