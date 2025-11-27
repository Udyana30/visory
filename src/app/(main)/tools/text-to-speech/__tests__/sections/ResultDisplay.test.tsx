import { render, screen, fireEvent } from '@testing-library/react';
import ResultDisplay from '@/app/(main)/tools/text-to-speech/sections/ResultDisplay';

// Mock useAudioPlayer hook untuk mengisolasi logic UI dari native Audio API
jest.mock('@/app/(main)/tools/text-to-speech/hooks/useAudioPlayer', () => ({
  useAudioPlayer: () => ({
    isPlaying: false,
    isLoading: false,
    duration: 100,
    currentTime: 0,
    progress: 0,
    error: null,
    togglePlay: jest.fn(),
    seek: jest.fn(),
    audioRef: { current: null },
  }),
}));

describe('White Box Testing - ResultDisplay Section', () => {
  
  // Step 1: Loading State
  it('1. Renders loading state correctly', () => {
    render(<ResultDisplay isLoading={true} error={null} result={null} />);
    expect(screen.getByText(/generating audio/i)).toBeInTheDocument();
  });

  // Step 2: Error State (Bagian dari Skenario 3)
  it('2. Renders error message correctly', () => {
    render(<ResultDisplay isLoading={false} error="API Failed" result={null} />);
    expect(screen.getByText(/api failed/i)).toBeInTheDocument();
  });

  // Step 3: Success State (Bagian dari Skenario 2)
  it('3. Renders result and player when data exists', () => {
    const mockResult = {
        id: 1,
        title: 'Success Audio',
        output_speech_url: 'http://test.com/audio.mp3',
        voice_name: 'Ardi',
        created_at: new Date().toISOString(),
        input_text: 'test'
    };

    render(<ResultDisplay isLoading={false} error={null} result={mockResult} />);
    
    // Cek Judul
    expect(screen.getByText('Success Audio')).toBeInTheDocument();
    // Cek Tombol Play muncul
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
    // Cek tombol Download ada
    expect(screen.getByTitle(/download audio/i)).toBeInTheDocument();
  });
});