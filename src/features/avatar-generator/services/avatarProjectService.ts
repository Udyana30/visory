import { avatarApiClient } from '@/lib/apiClient';
import { ApiAvatarProject, ApiAvatarStatusResponse } from '../types/api/project';
import { PaginatedResponse, PaginationParams } from '../types/api/pagination';
import { AvatarProject, CreateAvatarPayload } from '../types/domain/project';
import { mapToDomain } from '../utils/avatarMapper';
import { DEFAULT_AVATAR_PROMPT } from '../constants/defaults';
import { ApiCreateAvatarRequest } from '../types/api/request';

const PROJECT_ENDPOINT = '/projects/';
const DEFAULT_PAGE_LIMIT = 10;

export const avatarProjectService = {
  /**
   * Get paginated projects dengan cursor-based pagination
   * @param userId - User ID
   * @param params - Pagination parameters (limit, cursor)
   * @returns Paginated response dengan items, next_cursor, has_more
   */
  getPage: async (
    userId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<AvatarProject>> => {
    if (!userId) throw new Error('User ID is required');

    const { data } = await avatarApiClient.get<PaginatedResponse<ApiAvatarProject>>(
      PROJECT_ENDPOINT,
      {
        params: {
          user_id: userId,
          limit: params?.limit || DEFAULT_PAGE_LIMIT,
          ...(params?.cursor && { cursor: params.cursor })
        }
      }
    );

    return {
      items: data.items.map(mapToDomain),
      next_cursor: data.next_cursor,
      has_more: data.has_more
    };
  },

  /**
   * Legacy method - Load all projects (untuk backward compatibility)
   * Internally menggunakan pagination dan auto-load semua pages
   * @deprecated Use getPage() untuk better performance
   */
  getAll: async (userId: string): Promise<AvatarProject[]> => {
    if (!userId) throw new Error('User ID is required');

    const allProjects: AvatarProject[] = [];
    let cursor: string | null = null;
    let hasMore = true;

    // Auto-load all pages
    while (hasMore) {
      const page = await avatarProjectService.getPage(userId, { cursor, limit: 50 });
      allProjects.push(...page.items);
      cursor = page.next_cursor;
      hasMore = page.has_more;
    }

    return allProjects;
  },

  getById: async (id: string): Promise<AvatarProject> => {
    const { data } = await avatarApiClient.get<ApiAvatarProject>(`${PROJECT_ENDPOINT}${id}`);
    return mapToDomain(data);
  },

  create: async (payload: CreateAvatarPayload & { userId: string }): Promise<AvatarProject> => {
    if (!payload.userId) throw new Error('User ID is required');

    const requestBody: ApiCreateAvatarRequest = {
      user_id: String(payload.userId),
      title: payload.title,
      description: payload.description,
      prompt: payload.prompt || DEFAULT_AVATAR_PROMPT,
      image_url: payload.imageUrl,
      audio_url: payload.audioUrl,
      type: payload.type || 'single_person',
      audio_order: payload.audioOrder,
      audio_url_2: (payload as any).audioUrl2,

      parameters: {
        sample_steps: Number(payload.parameters.sampleSteps),
        sample_shift: Number(payload.parameters.sampleShift),
        sample_text_guide_scale: Number(payload.parameters.textGuideScale),
        sample_audio_guide_scale: Number(payload.parameters.audioGuideScale),
        lora_scale: Number(payload.parameters.loraScale),
        num_persistent_param_in_dit: Number(payload.parameters.numPersistentParamInDit),
        seed: Number(payload.parameters.seed),
      }
    };

    const { data } = await avatarApiClient.post<ApiAvatarProject>(PROJECT_ENDPOINT, requestBody);

    return mapToDomain(data);
  },

  /**
   * Get project status dengan pipeline support
   * Digunakan untuk polling progress
   */
  getStatus: async (id: string): Promise<Pick<AvatarProject, 'status' | 'progress' | 'videoUrl' | 'hasError' | 'errorMessage' | 'currentStage' | 'pipeline'>> => {
    const { data } = await avatarApiClient.get<ApiAvatarStatusResponse>(`${PROJECT_ENDPOINT}${id}/status`);

    return {
      status: data.status,
      progress: data.progress,
      videoUrl: data.video_url || undefined,
      hasError: data.status === 'failed',
      errorMessage: data.error_message || undefined,

      // Pipeline Support
      currentStage: data.current_stage || undefined,
      pipeline: data.pipeline || undefined
    };
  },

  deleteProject: async (id: string): Promise<void> => {
    const endpoint = `${PROJECT_ENDPOINT}${id}`;
    await avatarApiClient.delete(endpoint);
  }
};