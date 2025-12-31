import { avatarApiClient } from '@/lib/apiClient';
import {
    VoiceSample,
    TTSProject,
    TTSGenerateRequest,
    MultilingualTTSRequest,
    UploadVoiceRequest,
    VoiceConversionRequest,
    SupportedLanguages
} from '../../types/domain/chatterbox';

const AUDIO_BASE = '/audio';

export const chatterboxService = {
    getVoices: async (userId: string, includePublic: boolean = true, limit: number = 20, offset: number = 0): Promise<VoiceSample[]> => {
        const { data } = await avatarApiClient.get<VoiceSample[]>(`${AUDIO_BASE}/voice-library`, {
            params: {
                user_id: userId,
                include_public: String(includePublic),
                limit,
                offset
            }
        });
        return data;
    },

    uploadVoice: async (payload: UploadVoiceRequest): Promise<VoiceSample> => {
        const formData = new FormData();
        formData.append('audio_file', payload.audio_file);
        formData.append('name', payload.name);
        formData.append('user_id', payload.user_id);
        if (payload.description) formData.append('description', payload.description);
        if (payload.language_hint) formData.append('language_hint', payload.language_hint);
        if (payload.is_public !== undefined) formData.append('is_public', String(payload.is_public));

        const { data } = await avatarApiClient.post<VoiceSample>(`${AUDIO_BASE}/voice-library/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    },

    deleteVoice: async (voiceId: string, userId: string): Promise<void> => {
        await avatarApiClient.delete(`${AUDIO_BASE}/voice-library/${voiceId}`, {
            params: { user_id: userId }
        });
    },

    generateTTS: async (payload: TTSGenerateRequest): Promise<TTSProject> => {
        const { data } = await avatarApiClient.post<TTSProject>(`${AUDIO_BASE}/chatterbox/tts/generate`, payload);
        return data;
    },

    generateMultilingualTTS: async (payload: MultilingualTTSRequest): Promise<TTSProject> => {
        const { data } = await avatarApiClient.post<TTSProject>(`${AUDIO_BASE}/chatterbox/multilingual/generate`, payload);
        return data;
    },

    convertVoice: async (payload: VoiceConversionRequest): Promise<TTSProject> => {
        const formData = new FormData();
        formData.append('source_audio', payload.source_audio);
        formData.append('target_voice_sample_id', payload.target_voice_sample_id);
        formData.append('user_id', payload.user_id);

        const { data } = await avatarApiClient.post<TTSProject>(`${AUDIO_BASE}/voice-conversion/convert-upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    },

    getProjectStatus: async (projectId: string): Promise<TTSProject> => {
        const { data } = await avatarApiClient.get<TTSProject>(`${AUDIO_BASE}/chatterbox/projects/${projectId}`);
        return data;
    },

    deleteProject: async (projectId: string): Promise<void> => {
        await avatarApiClient.delete(`${AUDIO_BASE}/chatterbox/projects/${projectId}`);
    },

    getProjects: async (userId: string, projectType?: TTSProject['project_type'], limit: number = 50, offset: number = 0): Promise<TTSProject[]> => {
        const { data } = await avatarApiClient.get<TTSProject[]>(`${AUDIO_BASE}/chatterbox/projects`, {
            params: {
                user_id: userId,
                project_type: projectType,
                limit,
                offset
            }
        });
        return data;
    },

    getLanguages: async (): Promise<SupportedLanguages> => {
        return {
            "ar": "Arabic", "da": "Danish", "de": "German", "el": "Greek", "en": "English",
            "es": "Spanish", "fi": "Finnish", "fr": "French", "he": "Hebrew", "hi": "Hindi",
            "it": "Italian", "ja": "Japanese", "ko": "Korean", "ms": "Malay", "nl": "Dutch",
            "no": "Norwegian", "pl": "Polish", "pt": "Portuguese", "ru": "Russian", "sv": "Swedish",
            "sw": "Swahili", "tr": "Turkish", "zh": "Chinese"
        };
    }
};
