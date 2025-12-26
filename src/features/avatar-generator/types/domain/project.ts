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
}

export interface CreateAvatarPayload {
  title: string;
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