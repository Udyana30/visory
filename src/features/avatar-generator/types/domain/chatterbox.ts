export interface VoiceSample {
    voice_sample_id: string;
    name: string;
    description?: string;
    audio_url: string;
    duration_seconds?: number;
    sample_rate?: number;
    language_hint?: string;
    is_public: boolean;
    user_id: string;
    created_at: string;
}

export interface TTSProject {
    project_id: string;
    user_id: string;
    project_type: 'tts' | 'multilingual_tts' | 'voice-conversion' | 'voice_conversion';
    text: string;
    language_id?: string;
    voice_sample_id?: string;
    audio_url?: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number;
    error_message?: string;
    created_at: string;
}

export interface TTSGenerateRequest {
    text: string;
    voice_sample_id?: string;
    language_id?: string;
    exaggeration?: number;
    temperature?: number;
    cfg_weight?: number;
    repetition_penalty?: number;
    min_p?: number;
    top_p?: number;
    user_id: string;
}

export interface MultilingualTTSRequest {
    text: string;
    language_id: string;
    voice_sample_id?: string;
    exaggeration?: number;
    temperature?: number;
    user_id: string;
}

export interface UploadVoiceRequest {
    name: string;
    audio_file: File;
    description?: string;
    language_hint?: string;
    is_public?: boolean;
    user_id: string;
}

export interface VoiceConversionRequest {
    source_audio: File;
    target_voice_sample_id: string;
    user_id: string;
}

export interface SupportedLanguages {
    [key: string]: string;
}
