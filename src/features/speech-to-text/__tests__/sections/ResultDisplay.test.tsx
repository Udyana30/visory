import { render, screen } from '@testing-library/react';
import ResultDisplay from '@/app/(main)/tools/speech-to-text/sections/ResultDisplay'; // Sesuaikan path

describe('White Box - ResultDisplay', () => {
  // Mock HTMLMediaElement properties karena JSDOM tidak punya
  beforeAll(() => {
    Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', { value: jest.fn() });
    Object.defineProperty(window.HTMLMediaElement.prototype, 'play', { value: jest.fn() });
  });

  it('1. Renders loading state correctly', () => {
    render(<ResultDisplay isLoading={true} error={null} result={null} />);
    expect(screen.getByText(/transcribing audio.../i)).toBeInTheDocument();
  });

  it('2. Renders error state correctly', () => {
    render(<ResultDisplay isLoading={false} error="Network Error" result={null} />);
    expect(screen.getByText(/network error/i)).toBeInTheDocument();
  });

  it('3. Renders success result', () => {
    const mockResult = {
      id: 1,
      title: 'Transkripsi Sukses',
      input_audio_url: 'audio.mp3',
      output_raw_text: 'Halo ini teks',
      minio_bucket_name: '',
      input_minio_file_path: '',
      output_minio_file_path: '',
      output_srt_url: 'sub.srt',
      last_generated_url: '',
      created_at: new Date().toISOString(),
      language: 'id',
    };

    render(<ResultDisplay isLoading={false} error={null} result={mockResult} />);
    
    expect(screen.getByText('Transkripsi Sukses')).toBeInTheDocument();
    expect(screen.getByText('Halo ini teks')).toBeInTheDocument();
    expect(screen.getByText('id')).toBeInTheDocument(); // Language check
  });
});