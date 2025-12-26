import { avatarApiClient } from '@/lib/apiClient';
import { AvatarTemplate, CreateTemplatePayload } from '../types/domain/template';

const AVATAR_ENDPOINT = '/avatars';

export const avatarTemplateService = {
    getAll: async (): Promise<AvatarTemplate[]> => {
        const { data } = await avatarApiClient.get<AvatarTemplate[]>(`${AVATAR_ENDPOINT}/`);
        return data;
    },

    getByUserId: async (userId: string): Promise<AvatarTemplate[]> => {
        const { data } = await avatarApiClient.get<AvatarTemplate[]>(`${AVATAR_ENDPOINT}/`, {
            params: { user_id: userId }
        });
        return data;
    },

    create: async (payload: CreateTemplatePayload): Promise<AvatarTemplate> => {
        const formData = new FormData();
        formData.append('name', payload.name);
        formData.append('file', payload.file);
        formData.append('user_id', payload.userId);

        const { data } = await avatarApiClient.post<AvatarTemplate>(`${AVATAR_ENDPOINT}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    },

    delete: async (avatarId: string): Promise<void> => {
        await avatarApiClient.delete(`${AVATAR_ENDPOINT}/${avatarId}`);
    }
};
