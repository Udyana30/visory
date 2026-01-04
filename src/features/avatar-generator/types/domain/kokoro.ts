export interface KokoroVoice {
    id: string;
    name: string;
    gender: 'male' | 'female';
    language: string;
    langCode: string;
    preview_url?: string;
}

export interface KokoroLanguage {
    code: string;
    name: string;
}

export interface KokoroGenerateRequest {
    text: string;
    voice: string;
    speed: number;
    lang_code?: string;
    user_id: string;
}

export interface KokoroGenerateResponse {
    tts_id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    audio_url: string | null;
    text: string;
    voice: string;
    speed: number;
    created_at: string;
}
