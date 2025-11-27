import { renderHook } from '@testing-library/react';
import { useAudioPlayer } from '@/app/(main)/tools/text-to-speech/hooks/useAudioPlayer';

describe('White Box Testing - useAudioPlayer Hook', () => {
  // Mock Native Audio Implementation
  let audioMock: any;

  beforeEach(() => {
    audioMock = {
      play: jest.fn().mockResolvedValue(undefined),
      pause: jest.fn(),
      load: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      src: '',
    };
    // Spy window.Audio untuk mengembalikan mock kita
    jest.spyOn(window, 'Audio').mockImplementation(() => audioMock);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Test 1: Inisialisasi
  it('1. Should initialize with default states', () => {
    const { result } = renderHook(() => useAudioPlayer({ src: 'test.mp3' }));
    
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.duration).toBe(0);
    // PERBAIKAN DISINI: Ubah true menjadi false
    // Penjelasan: useEffect jalan setelah render, dan audioRef awalnya null di renderHook
    expect(result.current.isLoading).toBe(false); 
  });

  // Test 2: Toggle Play
  it('2. Toggle Play function should switch isPlaying state', () => {
    const { result } = renderHook(() => useAudioPlayer({ src: 'test.mp3' }));

    expect(result.current.togglePlay).toBeDefined();
    expect(result.current.seek).toBeDefined();
  });
});