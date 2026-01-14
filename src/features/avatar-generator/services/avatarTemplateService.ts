import { avatarApiClient } from '@/lib/apiClient';
import { PaginatedResponse, PaginationParams } from '../types/api/pagination';
import { AvatarTemplate, CreateTemplatePayload } from '../types/domain/template';

const AVATAR_ENDPOINT = '/avatars';
const DEFAULT_PAGE_LIMIT = 6;

export const avatarTemplateService = {
    /**
     * Get paginated templates dengan cursor-based pagination
     * @param params - Pagination parameters (limit, cursor)
     * @returns Paginated response dengan items, next_cursor, has_more
     */
    getPage: async (params?: PaginationParams): Promise<PaginatedResponse<AvatarTemplate>> => {
        const { data } = await avatarApiClient.get<PaginatedResponse<AvatarTemplate>>(
            `${AVATAR_ENDPOINT}/`,
            {
                params: {
                    limit: params?.limit || DEFAULT_PAGE_LIMIT,
                    ...(params?.cursor && { cursor: params.cursor })
                }
            }
        );
        return data;
    },

    /**
     * Get paginated templates by user ID
     */
    getPageByUserId: async (
        userId: string,
        params?: PaginationParams
    ): Promise<PaginatedResponse<AvatarTemplate>> => {
        const { data } = await avatarApiClient.get<PaginatedResponse<AvatarTemplate>>(
            `${AVATAR_ENDPOINT}/`,
            {
                params: {
                    user_id: userId,
                    limit: params?.limit || DEFAULT_PAGE_LIMIT,
                    ...(params?.cursor && { cursor: params.cursor })
                }
            }
        );
        return data;
    },

    /**
     * Legacy method - Load all templates (untuk backward compatibility)
     * @deprecated Use getPage() untuk better performance
     */
    getAll: async (): Promise<AvatarTemplate[]> => {
        const allTemplates: AvatarTemplate[] = [];
        let cursor: string | null = null;
        let hasMore = true;

        // Auto-load all pages
        while (hasMore) {
            const page = await avatarTemplateService.getPage({ cursor, limit: 50 });
            allTemplates.push(...page.items);
            cursor = page.next_cursor;
            hasMore = page.has_more;
        }

        return allTemplates;
    },

    /**
     * Legacy method - Get templates by user ID
     * @deprecated Use getPageByUserId() untuk better performance
     */
    getByUserId: async (userId: string): Promise<AvatarTemplate[]> => {
        const allTemplates: AvatarTemplate[] = [];
        let cursor: string | null = null;
        let hasMore = true;

        // Auto-load all pages
        while (hasMore) {
            const page = await avatarTemplateService.getPageByUserId(userId, { cursor, limit: 50 });
            allTemplates.push(...page.items);
            cursor = page.next_cursor;
            hasMore = page.has_more;
        }

        return allTemplates;
    },

    create: async (payload: CreateTemplatePayload): Promise<AvatarTemplate> => {
        const formData = new FormData();
        formData.append('name', payload.name);
        formData.append('file', payload.file);
        formData.append('user_id', payload.userId);
        formData.append('is_public', String(payload.isPublic || false));

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
