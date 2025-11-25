export interface SceneVisualization {
  id: string;
  prompt: string;
  aspectRatio: string;
  shotType: string;
  shotSize: string;
  shotAngle: string;
  lighting: string;
  mood: string;
  composition: string;
  characters: string[];
  imageUrl?: string;
  negativePrompt?: string;
}

export interface SceneFormData {
  prompt: string;
  aspectRatio: string;
  shotType: string;
  shotSize: string;
  shotAngle: string;
  lighting: string;
  mood: string;
  composition: string;
  characters: string[];
  negativePrompt?: string;
}