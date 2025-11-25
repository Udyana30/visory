export interface PageSize {
  width: number;
  height: number;
}

export interface CreateProjectRequest {
  name: string;
  page_size: PageSize;
  art_style: string;
}

export interface ProjectResponse {
  id: number;
  name: string;
  page_size: PageSize;
  art_style: string;
  created_at: string;
  updated_at: string;
}

export interface ComicListResponse {
  data: ProjectResponse[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface CreateCharacterRequest {
  name: string;
  type: string;
  project_id: number;
  prompt: string;
  clothing_prompt: string;
  negative_prompt: string;
  ref_image_url?: string | null;
}

export interface CharacterResponse {
  id: number;
  name: string;
  type: string;
  project_id: number;
  prompt: string;
  clothing_prompt: string;
  negative_prompt: string;
  ref_image_url: string | null;
  preview_url: string;
  llm_description: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateSceneRequest {
  character_ids?: number[];
  custom_ids?: number[];
  aspect_ratio: string;
  shot_type: string;
  shot_size: string;
  shot_angle: string;
  lighting: string;
  mood: string;
  composition: string;
  prompt: string;
  negative_prompt: string;
  project_id: number;
  background_id?: number | null;
}

export interface SceneResponse {
  id: number;
  character_ids: number[];
  background_id: number | null;
  aspect_ratio: string;
  shot_type: string;
  shot_size: string;
  shot_angle: string;
  lighting: string;
  mood: string;
  composition: string;
  prompt: string;
  negative_prompt: string;
  image_url: string;
  generation_history: any[];
  created_at: string;
  updated_at: string;
}

export interface ApiError {
  message: string;
  status?: number;
}