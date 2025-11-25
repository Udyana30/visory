import { ReferenceType } from "../api/reference";

export interface Reference {
  id: string;
  name: string;
  type: ReferenceType;
  imageUrl: string;
  prompt: string;
  clothingPrompt?: string;
  negativePrompt: string;
  llmDescription: string;
  isCustom: boolean;
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