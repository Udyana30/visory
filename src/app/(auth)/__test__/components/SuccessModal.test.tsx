import { render, screen, act } from '@testing-library/react';
import { SuccessModal } from '../../components/SuccessModal';
  
describe('White Box - SuccessModal', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // [SKENARIO PATH 3]: Modal muncul dan auto-close
  it('Memanggil onClose otomatis setelah durasi tertentu', () => {
    const mockOnClose = jest.fn();
    render(
      <SuccessModal 
        isOpen={true} 
        onClose={mockOnClose} 
        userEmail="test" 
        autoCloseDuration={2000} 
      />
    );

    expect(screen.getByText(/successfully logged in/i)).toBeInTheDocument();

    // Percepat waktu timer
    act(() => {
      jest.advanceTimersByTime(2500);
    });

    expect(mockOnClose).toHaveBeenCalled();
  });
});