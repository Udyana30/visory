import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SpeechToTextPage from '@/app/(main)/tools/speech-to-text/page';
import { sttService } from '@/services/sttService';

// 1. Mock Service
jest.mock('@/services/sttService');

// 2. Mock useAuth
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { name: 'User', email: 'user@test.com' },
    isAuthenticated: true,
  }),
}));

// 3. Mock TopBar
jest.mock('@/components/layout/TopBar', () => {
  return function MockTopBar({ pageTitle }: any) {
    return <div data-testid="top-bar">{pageTitle}</div>;
  };
});

// 4. Mock ScrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('White Box - STT Page Integration', () => {
  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', { value: jest.fn() });
    Object.defineProperty(window.HTMLMediaElement.prototype, 'play', { value: jest.fn() });
    Object.defineProperty(window.HTMLMediaElement.prototype, 'load', { value: jest.fn() });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock: History kosong saat load awal
    (sttService.getSTT as jest.Mock).mockResolvedValue({ data: [] });
  });

  // SKENARIO 2: Input Valid -> API Sukses
  it('1. [Scenario 2] Valid Input -> API Success -> Show Result', async () => {
    // A. Setup Mock Sukses
    const mockResultData = {
      id: 101,
      title: 'Project Sukses',
      input_audio_url: 'http://mock/audio.wav',
      output_raw_text: 'Ini hasil transkripsi',
      output_srt_url: 'http://mock/sub.srt',
      language: 'id',
      created_at: new Date().toISOString(),
    };
    
    (sttService.createSTT as jest.Mock).mockResolvedValue({
      message: 'Success',
      data: mockResultData
    });

    render(<SpeechToTextPage />);

    // B. PENTING: Tunggu fetch history awal selesai untuk mencegah act() warning
    await waitFor(() => expect(sttService.getSTT).toHaveBeenCalled());

    // C. User Upload File
    const file = new File(['audio content'], 'test.mp3', { type: 'audio/mpeg' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    // D. User Isi Judul
    const titleInput = screen.getByLabelText(/project title/i);
    fireEvent.change(titleInput, { target: { value: 'Project Sukses' } });

    // E. Klik Generate
    const generateBtn = screen.getByRole('button', { name: /generate transcription/i });
    fireEvent.click(generateBtn);

    // F. Cek Loading State
    expect(screen.getByRole('button', { name: /transcribing.../i })).toBeDisabled();

    // G. Tunggu Hasil Muncul
    await waitFor(() => {
      // Judul hasil muncul di ResultDisplay (Heading h3/h2)
      expect(screen.getByRole('heading', { name: 'Project Sukses' })).toBeInTheDocument();
      // Teks hasil muncul
      expect(screen.getByText('Ini hasil transkripsi')).toBeInTheDocument();
    });

    // H. Pastikan History di-refresh (2x calls: 1 mount, 1 after generate)
    expect(sttService.getSTT).toHaveBeenCalledTimes(2);
  });

  // SKENARIO 3: Input Valid -> API Gagal
  it('2. [Scenario 3] Valid Input -> API Fail -> Show Error Message', async () => {
    // A. Setup Mock Error
    (sttService.createSTT as jest.Mock).mockRejectedValue(new Error('Gagal memproses audio'));

    render(<SpeechToTextPage />);
    
    // B. Tunggu load awal
    await waitFor(() => expect(sttService.getSTT).toHaveBeenCalled());

    // C. User Isi Form
    const file = new File(['audio'], 'fail.mp3', { type: 'audio/mpeg' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    fireEvent.change(screen.getByLabelText(/project title/i), { target: { value: 'Project Gagal' } });

    // D. Klik Generate
    fireEvent.click(screen.getByRole('button', { name: /generate transcription/i }));

    // E. Tunggu Error Muncul
    await waitFor(() => {
      // Pastikan pesan error muncul
      expect(screen.getByText(/gagal memproses audio/i)).toBeInTheDocument();
    });

    // F. Pastikan tidak crash
    expect(screen.getByLabelText(/project title/i)).toBeInTheDocument();
  });
});