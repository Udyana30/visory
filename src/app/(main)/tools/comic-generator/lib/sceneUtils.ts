import { Character } from '../types/comic';

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

export const getAspectRatioValue = (label: string): string => aspectRatioMap[label] || '16:9';
export const getShotTypeValue = (label: string): string => shotTypeMap[label] || 'auto';
export const getShotSizeValue = (label: string): string => shotSizeMap[label] || 'auto';
export const getShotAngleValue = (label: string): string => shotAngleMap[label] || 'auto';
export const getLightingValue = (label: string): string => lightingMap[label] || 'auto';
export const getMoodValue = (label: string): string => moodMap[label] || 'auto';
export const getCompositionValue = (label: string): string => compositionMap[label] || 'auto';

export const getMentionLabel = (character: Character): string => {
  const isCustom = character.gender?.toLowerCase() === 'custom' || character.age === 'Custom';
  if (isCustom) {
    return `custom-${character.id}`;
  }
  return character.name.replace(/\s+/g, '_');
};

export const parseCharacterMentions = (
  prompt: string, 
  characterIds: string[],
  allCharacters: Character[]
): string => {
  let formattedPrompt = prompt;
  
  allCharacters.forEach(char => {
    if (characterIds.includes(char.id)) {
      const label = getMentionLabel(char);
      const mentionPattern = new RegExp(`@${label}\\b`, 'g');
      
      const isCustom = char.gender?.toLowerCase() === 'custom' || char.age === 'Custom';
      
      if (isCustom) {
        formattedPrompt = formattedPrompt.replace(mentionPattern, `@custom<${char.id}>`);
      } else {
        formattedPrompt = formattedPrompt.replace(mentionPattern, `@char<${char.id}>`);
      }
    }
  });
  
  return formattedPrompt;
};