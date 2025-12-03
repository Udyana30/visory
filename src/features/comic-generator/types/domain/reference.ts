import { ReferenceType } from "../api/reference";

export type ReferenceSource = 'generated' | 'upload';

export interface Reference {
  id: string;
  projectId: number;
  name: string;
  type: ReferenceType;
  source: ReferenceSource;
  imageUrl: string;
  prompt: string;
  clothingPrompt?: string;
  negativePrompt: string;
  llmDescription: string;
}

export interface CreateReferenceFormData {
  name: string;
  type: ReferenceType;
  prompt: string;
  clothingPrompt?: string;
  negativePrompt: string;
  style?: string;
  age?: string;
  gender?: string;
}