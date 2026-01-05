import { STTFormData } from '@/types/stt';

export const LANGUAGE_OPTIONS = [
    { id: 'id', name: 'Indonesian' },
    { id: 'en', name: 'English' },
    { id: 'ja', name: 'Japanese' },
    { id: 'zh', name: 'Chinese' },
    { id: 'ko', name: 'Korean' },
    { id: 'es', name: 'Spanish' },
    { id: 'fr', name: 'French' },
    { id: 'de', name: 'German' },
    { id: 'it', name: 'Italian' },
    { id: 'pt', name: 'Portuguese' },
    { id: 'nl', name: 'Dutch' },
    { id: 'hi', name: 'Hindi' },
    { id: 'ru', name: 'Russian' },
    { id: 'ar', name: 'Arabic' },
    { id: 'vi', name: 'Vietnamese' },
];

export const ALLOWED_AUDIO_FORMATS = ['audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/ogg', 'audio/flac'];
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

export const INITIAL_FORM_DATA: STTFormData = {
    title: 'My First STT Project',
    language: 'id',
    audio_file: null,
};
