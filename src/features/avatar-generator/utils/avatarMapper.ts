import { ApiAvatarProject } from '../types/api/project';
import { AvatarProject } from '../types/domain/project';

export const mapToDomain = (apiData: ApiAvatarProject): AvatarProject => {
  return {
    id: apiData.id,
    title: apiData.title || 'Untitled Project',
    description: apiData.description || undefined,
    imageUrl: apiData.image_url,
    audioUrl: apiData.audio_url,
    status: apiData.status,
    progress: apiData.progress,
    videoUrl: apiData.video_url || undefined,
    hasError: !!apiData.error_message || apiData.status === 'failed',
    errorMessage: apiData.error_message || undefined,
    createdAt: new Date(apiData.created_at),
    updatedAt: new Date(apiData.updated_at),
    type: apiData.type,
    parameters: apiData.parameters ? {
      sampleSteps: apiData.parameters.sample_steps,
      sampleShift: apiData.parameters.sample_shift,
      textGuideScale: apiData.parameters.sample_text_guide_scale,
      audioGuideScale: apiData.parameters.sample_audio_guide_scale,
      loraScale: apiData.parameters.lora_scale,
      numPersistentParamInDit: apiData.parameters.num_persistent_param_in_dit,
      seed: apiData.parameters.seed
    } : undefined
  };
};