import { 
  validateEmail, 
  validatePassword, 
  validateRequiredFields 
} from '../../utils/formValidation';

describe('White Box - Form Validation Utils', () => {
  
  // [SKENARIO PATH 1]: Validasi Input Kosong
  // Memastikan sistem mendeteksi field yang wajib diisi
  describe('validateRequiredFields', () => {
    it('Harus mengembalikan error jika ada field yang kosong', () => {
      const input = { email: '', password: '123' };
      const result = validateRequiredFields(input);
      expect(result.isValid).toBe(false);
      // Validasi pesan error sesuai spesifikasi "Please fill in all fields"
      expect(result.error).toMatch(/fill in all fields/i); 
    });

    it('Harus mengembalikan valid jika semua field terisi', () => {
      const input = { email: 'user@test.com', password: '123' };
      const result = validateRequiredFields(input);
      expect(result.isValid).toBe(true);
    });
  });

  // [SKENARIO PATH 1 & 2]: Validasi Format Email
  // Memastikan format email benar sebelum dikirim ke API
  describe('validateEmail', () => {
    it('Harus error jika format email tidak valid', () => {
      const result = validateEmail('email-invalid');
      expect(result.isValid).toBe(false);
    });

    it('Harus valid jika format email benar', () => {
      const result = validateEmail('user@example.com');
      expect(result.isValid).toBe(true);
    });
  });

  // Validasi Password
  describe('validatePassword', () => {
    it('Harus error jika password kurang dari panjang minimum', () => {
      const result = validatePassword('123', 6);
      expect(result.isValid).toBe(false);
    });
  });
});