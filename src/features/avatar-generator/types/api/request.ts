import { ApiAvatarParameters } from './project';

export interface ApiCreateAvatarRequest {
  title?: string;
  description?: string;
  image_url: string;
  audio_url: string;
  prompt?: string;
  parameters?: Partial<ApiAvatarParameters>;
  type?: 'single_person' | 'multi_person';
  audio_order?: string;
  audio_url_2?: string;
  user_id: string;
}