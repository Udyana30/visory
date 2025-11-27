import { render, screen, fireEvent } from '@testing-library/react';
import TtsForm from '@/app/(main)/tools/text-to-speech/sections/TtsForm';

describe('White Box Testing - TtsForm Section', () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  // SKENARIO 1: Validasi Input Kosong
  it('1. [Scenario 1] Should validate required fields and NOT call onSubmit if empty', () => {
    render(<TtsForm isLoading={false} onSubmit={mockSubmit} />);

    // 1. Cari tombol generate
    const submitBtn = screen.getByRole('button', { name: /generate voice/i });

    // 2. Kosongkan field input (simulasi user menghapus text)
    const titleInput = screen.getByLabelText(/project title/i);
    fireEvent.change(titleInput, { target: { value: '' } });
    
    const textArea = screen.getByLabelText(/text to convert/i);
    fireEvent.change(textArea, { target: { value: '' } });

    // 3. Klik tombol submit
    fireEvent.click(submitBtn);

    // 4. White Box Assert: Pastikan fungsi onSubmit TIDAK dipanggil
    // Karena HTML5 validation (required) akan mencegahnya di browser.
    // Di Jest/JSDOM, kita cek atribut required-nya.
    expect(titleInput).toBeRequired();
    expect(textArea).toBeRequired();
     // Validasi HTML5 failure state
    expect(titleInput).toBeInvalid();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  // SKENARIO: Input Valid
  it('2. Should call onSubmit with formatted data when inputs are valid', () => {
    render(<TtsForm isLoading={false} onSubmit={mockSubmit} />);

    // 1. Isi form dengan benar
    fireEvent.change(screen.getByLabelText(/project title/i), { target: { value: 'My Audio' } });
    fireEvent.change(screen.getByLabelText(/text to convert/i), { target: { value: 'Testing 123' } });

    // 2. Klik submit
    fireEvent.click(screen.getByRole('button', { name: /generate voice/i }));

    // 3. Verifikasi data terkirim
    expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({
      title: 'My Audio',
      input_text: 'Testing 123',
      rate: '+0%', // Default formatting check
    }));
  });
});