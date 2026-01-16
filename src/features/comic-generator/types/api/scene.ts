export interface SceneHistoryParams {
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
}

export interface GenerationHistoryItem {
  params: SceneHistoryParams;
  image_url: string;
  timestamp: string;
}

export interface CreateSceneRequest {
  project_id: number;
  character_ids?: number[] | null;
  custom_ids?: number[] | null;
  background_id?: number | null;
  aspect_ratio: string;
  shot_type: string;
  shot_size: string;
  shot_angle: string;
  lighting: string;
  mood: string;
  composition: string;
  prompt: string;
  negative_prompt: string;
}

export interface SceneResponse {
  id: number;
  project_id: number;
  character_ids: number[] | null;
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
  generation_history: GenerationHistoryItem[];
  created_at: string;
  updated_at: string;
}

// Paginated response type
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface SceneListResponse {
  data: SceneResponse[];
  meta: PaginationMeta;
}

export interface SceneListResponseLegacy {
  scenes: SceneResponse[];
}