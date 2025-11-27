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
  character_ids?: number[];
  custom_ids?: number[];
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

export interface SceneListResponse {
  scenes: SceneResponse[];
}