import { useState, useCallback } from 'react';
import { chatterboxService } from '../../services/tts/chatterboxService';
import { VoiceSample } from '../../types/domain/chatterbox';

interface UseVoiceUploadReturn {
    // Form State
    audioFile: File | null;
    name: string;
    description: string;
    languageHint: string;
    isPublic: boolean;

    // Upload State
    isUploading: boolean;
    error: string | null;

    // Actions
    setAudioFile: (file: File | null) => void;
    setName: (name: string) => void;
    setDescription: (desc: string) => void;
    setLanguageHint: (lang: string) => void;
    setIsPublic: (isPublic: boolean) => void;
    handleUpload: (userId: string) => Promise<VoiceSample>;
    reset: () => void;
    validateForm: () => string | null;
}

const ALLOWED_AUDIO_FORMATS = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/x-m4a', 'audio/m4a'];
const MAX_FILE_SIZE_MB = 10;

export const useVoiceUpload = (): UseVoiceUploadReturn => {
    // Form State
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [languageHint, setLanguageHint] = useState('');
    const [isPublic, setIsPublic] = useState(false);

    // Upload State
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateForm = useCallback((): string | null => {
        if (!audioFile) {
            return 'Audio file wajib diupload';
        }

        if (!ALLOWED_AUDIO_FORMATS.includes(audioFile.type)) {
            return 'Format audio tidak didukung. Gunakan WAV, MP3, atau M4A';
        }

        const fileSizeMB = audioFile.size / (1024 * 1024);
        if (fileSizeMB > MAX_FILE_SIZE_MB) {
            return `Ukuran file terlalu besar. Maksimal ${MAX_FILE_SIZE_MB}MB`;
        }

        if (!name.trim()) {
            return 'Nama voice wajib diisi';
        }

        if (name.trim().length < 3) {
            return 'Nama voice minimal 3 karakter';
        }

        if (name.length > 100) {
            return 'Nama voice maksimal 100 karakter';
        }

        if (description.length > 500) {
            return 'Deskripsi maksimal 500 karakter';
        }

        return null;
    }, [audioFile, name, description]);

    const handleUpload = useCallback(async (userId: string): Promise<VoiceSample> => {
        setError(null);

        // Validate form
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            throw new Error(validationError);
        }

        if (!audioFile) {
            throw new Error('Audio file tidak ditemukan');
        }

        setIsUploading(true);

        try {
            const payload = {
                audio_file: audioFile,
                name: name.trim(),
                user_id: userId,
                description: description.trim() || undefined,
                language_hint: languageHint || undefined,
                is_public: isPublic
            };

            const uploadedVoice = await chatterboxService.uploadVoice(payload);

            // Reset form on success
            reset();

            return uploadedVoice;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Gagal mengupload voice sample';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsUploading(false);
        }
    }, [audioFile, name, description, languageHint, isPublic, validateForm]);

    const reset = useCallback(() => {
        setAudioFile(null);
        setName('');
        setDescription('');
        setLanguageHint('');
        setIsPublic(false);
        setError(null);
    }, []);

    return {
        // Form State
        audioFile,
        name,
        description,
        languageHint,
        isPublic,

        // Upload State
        isUploading,
        error,

        // Actions
        setAudioFile,
        setName,
        setDescription,
        setLanguageHint,
        setIsPublic,
        handleUpload,
        reset,
        validateForm
    };
};
