import { 
    formatDateTime, 
    formatFileSize, 
    validateAudioFile, 
    formatPayload 
  } from '@/app/(main)/tools/speech-to-text/lib/stt.utils';
  import { STTFormData } from '@/types/stt';
  
  describe('White Box - STT Utils', () => {
    
    // 1. Test Format Tanggal
    describe('formatDateTime', () => {
      it('formats ISO string to readable date', () => {
        const date = new Date('2024-01-01T10:00:00Z');
        const result = formatDateTime(date.toISOString());
        // Cek output mengandung tahun dan bulan yang benar
        expect(result).toMatch(/Jan 1, 2024/); 
      });
    });
  
    // 2. Test Format Ukuran File (Matematika)
    describe('formatFileSize', () => {
      it('formats bytes to human readable string', () => {
        expect(formatFileSize(0)).toBe('0 Bytes');
        expect(formatFileSize(1024)).toBe('1 KB');
        expect(formatFileSize(1024 * 1024 * 2.5)).toBe('2.5 MB');
      });
    });
  
    // 3. Test Validasi File (Logika If/Else)
    describe('validateAudioFile', () => {
      it('returns valid for correct file type and size', () => {
        const file = new File(['dummy'], 'test.mp3', { type: 'audio/mpeg' });
        Object.defineProperty(file, 'size', { value: 1024 }); 
  
        const result = validateAudioFile(file);
        expect(result.valid).toBe(true);
      });
  
      it('returns error for unsupported format', () => {
        const file = new File(['dummy'], 'test.txt', { type: 'text/plain' });
        const result = validateAudioFile(file);
        
        expect(result.valid).toBe(false);
        expect(result.error).toMatch(/unsupported audio format/i);
      });
  
      it('returns error for file size too large (>50MB)', () => {
        const file = new File(['dummy'], 'large.mp3', { type: 'audio/mpeg' });
        // Mock size > 50MB (50 * 1024 * 1024 + 1)
        Object.defineProperty(file, 'size', { value: 52428801 });
  
        const result = validateAudioFile(file);
        expect(result.valid).toBe(false);
        expect(result.error).toMatch(/exceeds 50MB/i);
      });
    });
  
    // 4. Test Payload Creation
    describe('formatPayload', () => {
      it('constructs FormData correctly', () => {
        const file = new File(['content'], 'test.mp3');
        const mockData: STTFormData = {
          title: 'Test Project',
          language: 'id',
          audio_file: file,
        };
  
        const formData = formatPayload(mockData);
  
        expect(formData.get('title')).toBe('Test Project');
        expect(formData.get('language')).toBe('id');
        expect(formData.get('input_audio_file')).toBe(file);
      });
    });
  });