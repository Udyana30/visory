import { renderHook, act, waitFor } from '@testing-library/react';
import { useSTT } from '@/hooks/useSTT';
import { sttService } from '@/services/sttService';

jest.mock('@/services/sttService');

describe('White Box - useSTT Hook', () => {
  it('1. generateSTT handles success state updates', async () => {
    const mockData = { message: 'Success', data: { id: 1, title: 'Result' } };
    (sttService.createSTT as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useSTT());
    const formData = new FormData();

    await act(async () => {
      await result.current.generateSTT(formData);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.result).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('2. generateSTT handles error state updates', async () => {
    (sttService.createSTT as jest.Mock).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useSTT());
    const formData = new FormData();

    await act(async () => {
      try {
        await result.current.generateSTT(formData);
      } catch (e) {
        // Expected error
      }
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('API Error');
    expect(result.current.result).toBeNull();
  });
});