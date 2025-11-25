export type ReferenceType = 'character' | 'background';

export interface CreateReferenceRequest {
  name: string;
  type: ReferenceType;
  project_id: number;
  prompt: string;
  clothing_prompt?: string;
  negative_prompt: string;
  ref_image_url?: string | null;
}

export interface ReferenceResponse {
  id: number;
  user_id: number;
  project_id: number;
  name: string;
  type: ReferenceType;
  prompt: string;
  clothing_prompt: string | null;
  negative_prompt: string;
  ref_image_url: string | null;
  preview_url: string;
  llm_description: string;
  created_at: string;
  updated_at: string;
}