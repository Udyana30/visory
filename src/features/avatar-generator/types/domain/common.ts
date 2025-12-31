/**
 * Common types and enums shared across TTS features
 * 
 * Note: For PaginationParams and ApiResponseWrapper, use the global types from:
 * @see src/types/common.ts
 */

// ============================================================================
// ENUMS
// ============================================================================

/**
 * TTS Engine types
 */
export enum TTSEngine {
    KOKORO = 'kokoro',
    CHATTERBOX = 'chatterbox'
}

/**
 * Project status for TTS generation
 */
export enum ProjectStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed'
}

/**
 * Project types for ChatterBox
 */
export enum ProjectType {
    TTS = 'tts',
    MULTILINGUAL_TTS = 'multilingual_tts',
    VOICE_CONVERSION = 'voice_conversion'
}

/**
 * Generator modes for ChatterBox
 */
export enum GeneratorMode {
    CLONING = 'cloning',
    MULTILINGUAL = 'multilingual',
    VOICE_CHANGER = 'voice-changer'
}

// ============================================================================
// SHARED INTERFACES
// ============================================================================

/**
 * Audio metadata information
 */
export interface AudioMetadata {
    duration?: number;
    format?: string;
    sampleRate?: number;
    bitrate?: number;
}

/**
 * Common generation options
 */
export interface GenerationOptions {
    temperature: number;
    exaggeration: number;
}

/**
 * Base project interface with common fields
 */
export interface BaseProject {
    created_at: string;
    updated_at?: string;
    user_id: string;
    status: ProjectStatus;
    text?: string;
    audio_url?: string;
    error_message?: string;
}
