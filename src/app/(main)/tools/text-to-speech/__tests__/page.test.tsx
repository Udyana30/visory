import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TextToSpeechPage from '@/app/(main)/tools/text-to-speech/page';
import { ttsService } from '@/services/ttsService';

// 1. Mock ttsService
jest.mock('@/services/ttsService');

// 2. Mock useAuth Hook
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { name: 'Test User', email: 'test@example.com', image: null },
    isAuthenticated: true,
    logout: jest.fn(),
  }),
}));

// 3. Mock TopBar (Isolasi UI)
jest.mock('@/components/layout/TopBar', () => {
  return function MockTopBar(props: any) {
    return <div data-testid="top-bar">{props.pageTitle}</div>;
  };
});

describe('White Box Testing - TTS Page Integration', () => {
  // SETUP GLOBAL UNTUK MENGATASI ERROR JSDOM MEDIA
  beforeAll(() => {
    // JSDOM tidak mengimplementasikan metode media, kita harus mock manual
    // agar component ResultDisplay tidak crash saat memanggil audio.load()
    Object.defineProperty(window.HTMLMediaElement.prototype, 'load', {
      configurable: true,
      value: jest.fn(),
    });
    Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
      configurable: true,
      value: jest.fn(),
    });
    Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', {
      configurable: true,
      value: jest.fn(),
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default mock untuk History saat load awal
    (ttsService.getTTS as jest.Mock).mockResolvedValue({ data: [] });
  });

  // SKENARIO 2: Input Valid, API Sukses
  it('1. [Scenario 2] Valid Input -> API Success -> Show Result & Modal', async () => {
    // A. Setup Mock Return Value Sukses
    const mockSuccessResponse = {
      data: {
        id: 123,
        title: 'Project Bagus',
        input_text: 'Halo Dunia',
        output_speech_url: 'https://fake-url.com/audio.mp3',
        voice_name: 'id-ID-ArdiNeural',
        created_at: new Date().toISOString(),
      }
    };
    (ttsService.createTTS as jest.Mock).mockResolvedValue(mockSuccessResponse);

    render(<TextToSpeechPage />);

    // B. Tunggu load awal history selesai (Menghindari act warning)
    await waitFor(() => {
      expect(ttsService.getTTS).toHaveBeenCalled();
    });

    // C. User mengisi form
    const titleInput = screen.getByLabelText(/project title/i);
    const textInput = screen.getByLabelText(/text to convert/i);
    
    fireEvent.change(titleInput, { target: { value: 'Project Bagus' } });
    fireEvent.change(textInput, { target: { value: 'Halo Dunia' } });

    // D. Klik Generate
    const generateBtn = screen.getByRole('button', { name: /generate voice/i });
    fireEvent.click(generateBtn);

    // E. Cek Loading State
    // Kita gunakan teks spesifik agar tidak ambigu dengan tombol
    expect(screen.getByText('Generating audio...')).toBeInTheDocument();

    // F. Tunggu hasil muncul
    await waitFor(() => {
      // 1. Cek Modal Sukses Muncul
      expect(screen.getByText(/generation successful/i)).toBeInTheDocument();
      
      // 2. PERBAIKAN MULTIPLE ELEMENTS ERROR:
      // Gunakan getByRole 'heading' untuk memastikan kita mengambil Judul Hasil
      // bukan teks di dalam input atau span lain.
      expect(screen.getByRole('heading', { name: 'Project Bagus' })).toBeInTheDocument();
    });

    // G. Pastikan History di-refresh
    expect(ttsService.getTTS).toHaveBeenCalledTimes(2);
  });

  // SKENARIO 3: Input Valid, API Gagal
  it('2. [Scenario 3] Valid Input -> API Fail -> Show Error Message', async () => {
    // A. Setup Mock Error
    const errorMessage = 'Error Transkripsi';
    (ttsService.createTTS as jest.Mock).mockRejectedValue(new Error(errorMessage));

    render(<TextToSpeechPage />);

    // B. Tunggu load awal selesai
    await waitFor(() => {
      expect(ttsService.getTTS).toHaveBeenCalled();
    });

    // C. User mengisi form
    fireEvent.change(screen.getByLabelText(/project title/i), { target: { value: 'Project Gagal' } });
    fireEvent.change(screen.getByLabelText(/text to convert/i), { target: { value: 'Tes Error' } });

    // D. Klik Generate
    fireEvent.click(screen.getByRole('button', { name: /generate voice/i }));

    // E. Tunggu pesan error muncul
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // F. Pastikan Form masih ada
    expect(screen.getByLabelText(/project title/i)).toBeInTheDocument();
  });
});