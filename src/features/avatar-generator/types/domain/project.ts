import { Pipeline, PipelineStageKey } from '../api/pipeline';

export type AvatarStatus = 'queued' | 'processing' | 'finished' | 'failed';

export interface AvatarParameters {
  sampleSteps: number;
  sampleShift: number;
  textGuideScale: number;
  audioGuideScale: number;
  loraScale: number;
  numPersistentParamInDit: number;
  seed: number;
}

export interface AvatarProject {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  audioUrl: string;
  status: AvatarStatus;
  progress: number;
  videoUrl?: string;
  hasError: boolean;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
  parameters?: AvatarParameters;
  type?: 'single_person' | 'multi_person';

  // Multi-Stage Pipeline Support
  currentStage?: PipelineStageKey;
  pipeline?: Pipeline;
}

export interface CreateAvatarPayload {
  title: string;
  description?: string;
  prompt: string;
  imageUrl: string;
  audioUrl: string;
  parameters: AvatarParameters;
  userId?: string;
  imageFile?: File;
  audioFile?: File;
  type?: 'single_person' | 'multi_person';
  audioOrder?: string;
  secondAudioFile?: File;
}