import { avatarApiClient } from '@/lib/apiClient';
import { PaginatedResponse, PaginationParams } from '../../types/api/pagination';
import { KokoroGenerateRequest, KokoroGenerateResponse, KokoroVoice } from '../../types/domain/kokoro';

const KOKORO_BASE = '/tts';
const DEFAULT_PAGE_LIMIT = 50;

let voicesCache: KokoroVoice[] | null = null;
let languagesCache: any[] | null = null;

export const kokoroService = {
    getVoices: async (): Promise<KokoroVoice[]> => {
        if (voicesCache) return voicesCache;

        let languages = languagesCache;
        if (!languages) {
            const { data: langData } = await avatarApiClient.get<{ languages: any[] }>(`${KOKORO_BASE}/languages`);
            languages = langData.languages;
            languagesCache = languages;
        }

        const languageMap: { [key: string]: string } = {};
        languages?.forEach((lang: any) => {
            languageMap[lang.code] = lang.name;
        });

        const { data } = await avatarApiClient.get<{ voices: any[] }>(`${KOKORO_BASE}/voices`);

        const mappedVoices = data.voices.map((v: any) => ({
            id: v.id,
            name: v.name,
            gender: v.gender,
            language: languageMap[v.lang] || v.lang,
            langCode: v.lang,
            preview_url: v.preview_url
        }));

        voicesCache = mappedVoices;
        return mappedVoices;
    },

    getLanguages: async (): Promise<any[]> => {
        if (languagesCache) return languagesCache;
        const { data } = await avatarApiClient.get<{ languages: any[] }>(`${KOKORO_BASE}/languages`);
        languagesCache = data.languages;
        return data.languages;
    },

    generateAudio: async (payload: KokoroGenerateRequest): Promise<KokoroGenerateResponse> => {
        const { data } = await avatarApiClient.post<KokoroGenerateResponse>(`${KOKORO_BASE}/generate/`, payload);
        return data;
    },

    checkStatus: async (ttsId: string): Promise<KokoroGenerateResponse> => {
        const { data } = await avatarApiClient.get<KokoroGenerateResponse>(`${KOKORO_BASE}/${ttsId}`);
        return data;
    },

    getPage: async (userId: string, params?: PaginationParams): Promise<PaginatedResponse<KokoroGenerateResponse>> => {
        const { data } = await avatarApiClient.get<PaginatedResponse<KokoroGenerateResponse>>(`${KOKORO_BASE}/`, {
            params: {
                user_id: userId,
                limit: params?.limit || DEFAULT_PAGE_LIMIT,
                ...(params?.cursor && { cursor: params.cursor })
            }
        });
        return data;
    },

    getProjects: async (userId: string): Promise<KokoroGenerateResponse[]> => {
        const allProjects: KokoroGenerateResponse[] = [];
        let cursor: string | null = null;
        let hasMore = true;

        while (hasMore) {
            const page = await kokoroService.getPage(userId, { cursor, limit: DEFAULT_PAGE_LIMIT });
            allProjects.push(...page.items);
            cursor = page.next_cursor;
            hasMore = page.has_more;
        }

        return allProjects;
    },

    deleteProject: async (ttsId: string): Promise<void> => {
        await avatarApiClient.delete(`${KOKORO_BASE}/${ttsId}`);
    }
};
