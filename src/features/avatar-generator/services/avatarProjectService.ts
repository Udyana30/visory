import { avatarApiClient } from '@/lib/apiClient';
import { ApiAvatarProject, ApiAvatarStatusResponse } from '../types/api/project';
import { AvatarProject, CreateAvatarPayload } from '../types/domain/project';
import { mapToDomain } from '../utils/avatarMapper';
import { DEFAULT_AVATAR_PROMPT } from '../constants/defaults';
import { ApiCreateAvatarRequest } from '../types/api/request';

const PROJECT_ENDPOINT = '/projects/';

export const avatarProjectService = {
  getAll: async (userId: string): Promise<AvatarProject[]> => {
    if (!userId) throw new Error('User ID is required');

    const { data } = await avatarApiClient.get<ApiAvatarProject[]>(PROJECT_ENDPOINT, {
      params: { user_id: userId }
    });

    return Array.isArray(data) ? data.map(mapToDomain) : [];
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

  getStatus: async (id: string): Promise<Pick<AvatarProject, 'status' | 'progress' | 'videoUrl' | 'hasError' | 'errorMessage'>> => {
    const { data } = await avatarApiClient.get<ApiAvatarStatusResponse>(`${PROJECT_ENDPOINT}${id}/status`);

    return {
      status: data.status,
      progress: data.progress,
      videoUrl: data.video_url || undefined,
      hasError: data.status === 'failed',
      errorMessage: data.error_message || undefined
    };
  },

  deleteProject: async (id: string): Promise<void> => {
    const endpoint = `${PROJECT_ENDPOINT}${id}`;
    await avatarApiClient.delete(endpoint);
  }
};