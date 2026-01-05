import { STTFormData } from '@/types/stt';

export const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};

export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatPayload = (formData: STTFormData): FormData => {
    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('language', formData.language);
    if (formData.audio_file) {
        payload.append('input_audio_file', formData.audio_file);
    }
    return payload;
};

export const validateAudioFile = (file: File): { valid: boolean; error?: string } => {
    const allowedFormats = ['audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/ogg', 'audio/flac'];
    const maxSize = 50 * 1024 * 1024;

    if (!allowedFormats.includes(file.type)) {
        return {
            valid: false,
            error: 'Unsupported audio format. Allowed formats: MP3, WAV, M4A, OGG, FLAC',
        };
    }

    if (file.size > maxSize) {
        return {
            valid: false,
            error: 'File size exceeds 50MB limit',
        };
    }

    return { valid: true };
};
