/**
 * Audio utilities for TTS features
 */

import { DEFAULT_AUDIO_FORMAT } from './constants';

// ============================================================================
// AUDIO DOWNLOAD
// ============================================================================

/**
 * Download audio from URL and convert to File object
 * @param url - Audio URL
 * @param filename - Optional custom filename
 * @returns File object
 * @throws Error if download fails
 */
export const downloadAudio = async (url: string, filename?: string): Promise<File> => {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch audio: ${response.statusText}`);
        }

        const blob = await response.blob();
        const finalFilename = filename || `tts_generated_${Date.now()}.wav`;
        const file = new File([blob], finalFilename, { type: DEFAULT_AUDIO_FORMAT });

        return file;
    } catch (error) {
        console.error('Download audio error:', error);
        throw new Error('Failed to download audio');
    }
};

/**
 * Download audio and trigger browser download
 * @param url - Audio URL
 * @param filename - Filename for download
 */
export const downloadAudioToDevice = (url: string, filename: string): void => {
    try {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Download to device error:', error);
        throw new Error('Failed to download audio to device');
    }
};

// ============================================================================
// AUDIO VALIDATION
// ============================================================================

/**
 * Validate audio file type
 * @param file - File to validate
 * @returns True if valid audio file
 */
export const isValidAudioFile = (file: File): boolean => {
    const validTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg', 'audio/webm'];
    return validTypes.includes(file.type);
};

/**
 * Validate audio file size
 * @param file - File to validate
 * @param maxSizeInBytes - Maximum size in bytes
 * @returns True if file size is valid
 */
export const isValidAudioSize = (file: File, maxSizeInBytes: number): boolean => {
    return file.size <= maxSizeInBytes;
};

/**
 * Get audio file extension from filename
 * @param filename - Filename
 * @returns File extension (e.g., "wav")
 */
export const getAudioExtension = (filename: string): string => {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};

// ============================================================================
// AUDIO METADATA
// ============================================================================

/**
 * Get audio duration from File object
 * @param file - Audio file
 * @returns Promise with duration in seconds
 */
export const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
        const audio = new Audio();
        const objectUrl = URL.createObjectURL(file);

        audio.addEventListener('loadedmetadata', () => {
            URL.revokeObjectURL(objectUrl);
            resolve(audio.duration);
        });

        audio.addEventListener('error', () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Failed to load audio metadata'));
        });

        audio.src = objectUrl;
    });
};

/**
 * Get audio duration from URL
 * @param url - Audio URL
 * @returns Promise with duration in seconds
 */
export const getAudioDurationFromUrl = (url: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        const audio = new Audio();

        audio.addEventListener('loadedmetadata', () => {
            resolve(audio.duration);
        });

        audio.addEventListener('error', () => {
            reject(new Error('Failed to load audio metadata'));
        });

        audio.src = url;
    });
};

// ============================================================================
// AUDIO CONVERSION
// ============================================================================

/**
 * Convert File to base64 string
 * @param file - File to convert
 * @returns Promise with base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('Failed to convert file to base64'));
            }
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(file);
    });
};

/**
 * Convert base64 string to Blob
 * @param base64 - Base64 string
 * @param mimeType - MIME type (default: audio/wav)
 * @returns Blob object
 */
export const base64ToBlob = (base64: string, mimeType: string = DEFAULT_AUDIO_FORMAT): Blob => {
    const byteString = atob(base64.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeType });
};

// ============================================================================
// AUDIO URL HELPERS
// ============================================================================

/**
 * Create object URL from File
 * @param file - File object
 * @returns Object URL
 */
export const createAudioObjectUrl = (file: File): string => {
    return URL.createObjectURL(file);
};

/**
 * Revoke object URL
 * @param url - Object URL to revoke
 */
export const revokeAudioObjectUrl = (url: string): void => {
    try {
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Failed to revoke object URL:', error);
    }
};
