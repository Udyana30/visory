import { Pipeline, PipelineStageKey } from './pipeline';

export type ApiAvatarStatus = 'queued' | 'processing' | 'finished' | 'failed';

export interface ApiAvatarParameters {
  sample_steps: number;
  sample_shift: number;
  sample_text_guide_scale: number;
  sample_audio_guide_scale: number;
  lora_scale: number;
  num_persistent_param_in_dit: number;
  seed: number;
}

export interface ApiAvatarProject {
  id: string;
  user_id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  audio_url: string;
  prompt: string;
  call_id: string;
  status: ApiAvatarStatus;
  progress: number;
  video_url: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  parameters: ApiAvatarParameters;
  type?: 'single_person' | 'multi_person';
  audio_order?: string | null;
  audio_url_2?: string | null;

  // Multi-Stage Pipeline Support
  current_stage: PipelineStageKey | null;
  pipeline: Pipeline | null;
}

export interface ApiAvatarStatusResponse {
  id: string;
  status: ApiAvatarStatus;
  progress: number;
  video_url: string | null;
  error_message: string | null;

  // Multi-Stage Pipeline Support
  current_stage?: PipelineStageKey | null;
  pipeline?: Pipeline | null;
}