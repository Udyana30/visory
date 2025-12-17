import { ApiAvatarParameters } from './project';

export interface ApiCreateAvatarRequest {
  title?: string;
  description?: string;
  image_url: string;
  audio_url: string;
  prompt?: string;
  parameters?: Partial<ApiAvatarParameters>;
}