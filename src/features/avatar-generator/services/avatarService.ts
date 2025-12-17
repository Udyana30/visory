import { avatarApiClient } from '@/lib/apiClient';
import { ApiAvatarProject, ApiAvatarStatusResponse } from '../types/api/project';
import { AvatarProject, CreateAvatarPayload } from '../types/domain/project';
import { mapToDomain } from '../utils/avatarMapper';
import { AVATAR_API_ENDPOINTS, DEFAULT_AVATAR_PROMPT } from '../constants/defaults';

export const avatarService = {
  getAll: async (): Promise<AvatarProject[]> => {
    const { data } = await avatarApiClient.get<ApiAvatarProject[]>(AVATAR_API_ENDPOINTS.BASE);
    return data.map(mapToDomain);
  },

  getById: async (id: string): Promise<AvatarProject> => {
    const { data } = await avatarApiClient.get<ApiAvatarProject>(AVATAR_API_ENDPOINTS.BY_ID(id));
    return mapToDomain(data);
  },

  create: async (payload: CreateAvatarPayload): Promise<AvatarProject> => {
    const requestBody = {
      title: payload.title,
      image_url: payload.imageUrl,
      audio_url: payload.audioUrl,
      prompt: payload.prompt || DEFAULT_AVATAR_PROMPT,
      parameters: {
        sample_steps: payload.parameters.sampleSteps,
        sample_shift: payload.parameters.sampleShift,
        sample_text_guide_scale: payload.parameters.textGuideScale,
        sample_audio_guide_scale: payload.parameters.audioGuideScale,
        lora_scale: payload.parameters.loraScale,
        num_persistent_param_in_dit: payload.parameters.numPersistentParamInDit,
        seed: payload.parameters.seed
      }
    };

    const { data } = await avatarApiClient.post<ApiAvatarProject>(AVATAR_API_ENDPOINTS.BASE, requestBody);
    return mapToDomain(data);
  },

  getStatus: async (id: string): Promise<Pick<AvatarProject, 'status' | 'progress' | 'videoUrl' | 'hasError' | 'errorMessage'>> => {
    const { data } = await avatarApiClient.get<ApiAvatarStatusResponse>(AVATAR_API_ENDPOINTS.STATUS(id));
    
    return {
      status: data.status,
      progress: data.progress,
      videoUrl: data.video_url || undefined,
      hasError: !!data.error_message || data.status === 'failed',
      errorMessage: data.error_message || undefined,
    };
  },
};