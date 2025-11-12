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
  
  export const getAspectRatioValue = (label: string): string => {
    return aspectRatioMap[label] || '16:9';
  };
  
  export const getShotTypeValue = (label: string): string => {
    return shotTypeMap[label] || 'auto';
  };
  
  export const getShotSizeValue = (label: string): string => {
    return shotSizeMap[label] || 'auto';
  };
  
  export const getShotAngleValue = (label: string): string => {
    return shotAngleMap[label] || 'auto';
  };
  
  export const getLightingValue = (label: string): string => {
    return lightingMap[label] || 'auto';
  };
  
  export const getMoodValue = (label: string): string => {
    return moodMap[label] || 'auto';
  };
  
  export const getCompositionValue = (label: string): string => {
    return compositionMap[label] || 'auto';
  };
  
  export const parseCharacterMentions = (prompt: string, characterIds: string[]): string => {
    let formattedPrompt = prompt;
    
    characterIds.forEach(id => {
      const mentionPattern = new RegExp(`@${id}\\b`, 'g');
      formattedPrompt = formattedPrompt.replace(mentionPattern, `@char<${id}>`);
    });
    
    return formattedPrompt;
  };
  
  export const insertCharacterMention = (
    prompt: string, 
    cursorPosition: number, 
    characterId: string
  ): { newPrompt: string; newCursorPosition: number } => {
    const mention = `@${characterId} `;
    const newPrompt = 
      prompt.slice(0, cursorPosition) + 
      mention + 
      prompt.slice(cursorPosition);
    const newCursorPosition = cursorPosition + mention.length;
    
    return { newPrompt, newCursorPosition };
  };