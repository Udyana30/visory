import { renderHook, act } from '@testing-library/react';
import { useForm } from '../../hooks/useForm';

describe('White Box - useForm Hook', () => {
  it('Harus menginisialisasi dengan nilai awal', () => {
    const { result } = renderHook(() => useForm({ email: '' }));
    expect(result.current.formData.email).toBe('');
  });

  it('handleChange harus memperbarui state form', () => {
    const { result } = renderHook(() => useForm({ email: '' }));

    act(() => {
      // Simulasi event change input HTML
      const event = {
        target: { name: 'email', value: 'baru@test.com' }
      } as React.ChangeEvent<HTMLInputElement>;
      
      result.current.handleChange(event);
    });

    expect(result.current.formData.email).toBe('baru@test.com');
  });

  it('resetForm harus mengembalikan ke nilai awal', () => {
    const { result } = renderHook(() => useForm({ email: '' }));

    // Ubah dulu
    act(() => {
      const event = { target: { name: 'email', value: 'ubah' } } as any;
      result.current.handleChange(event);
    });

    // Reset
    act(() => {
      result.current.resetForm();
    });

    expect(result.current.formData.email).toBe('');
  });
});