import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SttForm from '@/app/(main)/tools/speech-to-text/sections/SttForm';

describe('White Box - SttForm', () => {
  beforeAll(() => {
    // Mock URL.createObjectURL karena tidak ada di lingkungan JSDOM
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
  });

  // SKENARIO 1: Validasi Input Kosong
  // Menguji apakah handler menampilkan pesan error saat data tidak lengkap
  it('1. [Scenario 1] Shows validation error when submitting without file', async () => {
    const mockSubmit = jest.fn();
    const { container } = render(<SttForm isLoading={false} onSubmit={mockSubmit} />);

    // 1. Isi Title saja (File dibiarkan kosong)
    const titleInput = screen.getByLabelText(/project title/i);
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });

    // 2. Trigger Submit
    // tembak event 'submit' langsung ke form untuk menguji logika validasi internal handler.
    const form = container.querySelector('form');
    if (form) fireEvent.submit(form);

    // 3. White Box Check: Pastikan state validationError ter-update dan pesan muncul
    expect(await screen.findByText(/please select or record an audio file/i)).toBeInTheDocument();
    
    // 4. Pastikan fungsi onSubmit (ke API) TIDAK dipanggil
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  // SKENARIO 2: Upload Valid & Submit
  // Menguji interaksi upload file dan pengiriman data
  it('2. Uploading valid file updates state and clears error', async () => {
    const mockSubmit = jest.fn();
    const { container } = render(<SttForm isLoading={false} onSubmit={mockSubmit} />);

    // 1. Simulasikan pilih file
    const file = new File(['dummy content'], 'audio.mp3', { type: 'audio/mpeg' });
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    
    expect(fileInput).toBeInTheDocument();
    fireEvent.change(fileInput, { target: { files: [file] } });

    // 2. Isi Title
    fireEvent.change(screen.getByLabelText(/project title/i), { target: { value: 'My Project' } });

    // 3. Klik Submit
    const submitBtn = screen.getByRole('button', { name: /generate transcription/i });
    expect(submitBtn).toBeEnabled();
    fireEvent.click(submitBtn);

    // 4. Verifikasi payload terkirim ke parent component
    await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalled();
        
        const formDataArg = mockSubmit.mock.calls[0][0] as FormData;
        expect(formDataArg.get('title')).toBe('My Project');
    });
  });
});