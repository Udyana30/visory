import { ReferenceResponse } from "../types/api/reference";
import { Reference, ReferenceSource } from "../types/domain/reference";

export const mapToDomain = (data: ReferenceResponse): Reference => {

  const rawType = data.type as string; 
  
  let domainType = data.type;
  let domainSource: ReferenceSource = 'generated';

  if (rawType === 'custom') {
    domainType = 'character';
    domainSource = 'upload';
  } else if (data.ref_image_url) {
    domainSource = 'upload';
  }

  return {
    id: data.id.toString(),
    projectId: data.project_id,
    name: data.name,
    type: rawType === 'custom' ? 'character' : domainType,
    source: domainSource,
    imageUrl: data.preview_url || data.ref_image_url || '',
    prompt: data.prompt,
    clothingPrompt: data.clothing_prompt || undefined,
    negativePrompt: data.negative_prompt,
    llmDescription: data.llm_description,
  };
};