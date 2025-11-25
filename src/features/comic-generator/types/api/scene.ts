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