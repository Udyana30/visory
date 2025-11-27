import { Reference } from '../types/domain/reference';

export const aspectRatioMap: Record<string, string> = {
  'Square (1:1)': '1:1',
  'Portrait (9:16)': '9:16',
  'Landscape (16:9)': '16:9',
  'Portrait (3:4)': '3:4',
  'Landscape (4:3)': '4:3',
};

export const shotTypeMap: Record<string, string> = {
  'Auto': 'auto',
  'Front View': 'front',
  'Side View': 'side',
  'Back View': 'back',
};

export const shotSizeMap: Record<string, string> = {
  'Auto': 'auto',
  'Close-Up': 'closeup',
  'Medium Shot': 'medium',
  'Full Body': 'fullbody',
};

export const shotAngleMap: Record<string, string> = {
  'Auto': 'auto',
  'Eye Level': 'eye_level',
  'Above': 'above',
  'Below': 'below',
};

export const lightingMap: Record<string, string> = {
  'Auto': 'auto',
  'Natural': 'natural',
  'Dramatic': 'dramatic',
  'Dim': 'dim',
};

export const moodMap: Record<string, string> = {
  'Auto': 'auto',
  'Happy': 'happy',
  'Sad': 'sad',
  'Epic': 'epic',
  'Neutral': 'neutral',
};

export const compositionMap: Record<string, string> = {
  'Auto': 'auto',
  'Symmetric': 'symmetric',
  'Rule of Thirds': 'rule_of_thirds',
  'Centered': 'centered',
};

export const getAspectRatioValue = (label: string) => aspectRatioMap[label] || '16:9';
export const getShotTypeValue = (label: string) => shotTypeMap[label] || 'auto';
export const getShotSizeValue = (label: string) => shotSizeMap[label] || 'auto';
export const getShotAngleValue = (label: string) => shotAngleMap[label] || 'auto';
export const getLightingValue = (label: string) => lightingMap[label] || 'auto';
export const getMoodValue = (label: string) => moodMap[label] || 'auto';
export const getCompositionValue = (label: string) => compositionMap[label] || 'auto';

export const getMentionLabel = (reference: Reference): string => {
  if (reference.isCustom) {
    return `custom-${reference.id}`;
  }
  return reference.name.replace(/\s+/g, '_');
};

export const parseCharacterMentions = (
  prompt: string, 
  referenceIds: string[],
  allReferences: Reference[]
): string => {
  let formattedPrompt = prompt;
  
  allReferences.forEach(ref => {
    if (referenceIds.includes(ref.id)) {
      const label = getMentionLabel(ref);
      const mentionPattern = new RegExp(`@${label}\\b`, 'g');
      
      if (ref.isCustom) {
        formattedPrompt = formattedPrompt.replace(mentionPattern, `@custom<${ref.id}>`);
      } else {
        formattedPrompt = formattedPrompt.replace(mentionPattern, `@char<${ref.id}>`);
      }
    }
  });
  
  return formattedPrompt;
};