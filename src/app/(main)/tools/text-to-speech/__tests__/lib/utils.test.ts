import { formatPayload } from '@/app/(main)/tools/text-to-speech/lib/tts.utils';
import { formatDuration } from '@/app/(main)/tools/text-to-speech/lib/audio.utils';
import { INITIAL_FORM_DATA } from '@/app/(main)/tools/text-to-speech/lib/tts.constants';

describe('White Box Testing - Utility Functions', () => {
  
  // Test Group 1: Audio Utils
  describe('audio.utils.ts', () => {
    // Step 1: Menguji format durasi normal
    it('1. formatDuration converts seconds to MM:SS format correctly', () => {
      expect(formatDuration(65)).toBe('1:05');
      expect(formatDuration(10)).toBe('0:10');
    });

    // Step 2: Menguji edge case (0 atau invalid)
    it('2. formatDuration handles zero or invalid inputs gracefully', () => {
      expect(formatDuration(0)).toBe('0:00');
      expect(formatDuration(NaN)).toBe('0:00');
    });
  });

  // Test Group 2: TTS Utils (Format Payload)
  describe('tts.utils.ts', () => {
    // Step 3: Menguji transformasi data form ke payload API
    it('3. formatPayload transforms FormData to API request structure', () => {
      const mockFormData = {
        ...INITIAL_FORM_DATA,
        title: 'Test Project',
        input_text: 'Hello World',
        rate: 10,
        volume: -5,
        pitch: 0,
      };

      const result = formatPayload(mockFormData);

      // White box check: Pastikan format string (misal: "10%") sesuai
      expect(result).toEqual({
        title: 'Test Project',
        input_text: 'Hello World',
        voice_name: 'en-US-AriaNeural', // Default
        rate: '+10%',  // Cek penambahan tanda +
        volume: '-5%', // Cek tanda - tetap
        pitch: '+0Hz', // Cek unit Hz
      });
    });
  });
});