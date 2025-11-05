export const ASPECT_RATIOS = [
    'Square (1:1)', 
    'Portrait (9:16)', 
    'Landscape (16:9)', 
    'Widescreen (21:9)'
  ];
  
  export const SHOT_TYPES = [
    'Front View', 
    'Side View', 
    'Back View', 
    'Three-Quarter View', 
    'Bird\'s Eye View'
  ];
  
  export const SHOT_SIZES = [
    'Extreme Close-Up', 
    'Close-Up', 
    'Medium Shot', 
    'Full Shot', 
    'Long Shot'
  ];
  
  export const SHOT_ANGLES = [
    'Eye Level', 
    'High Angle', 
    'Low Angle', 
    'Dutch Angle', 
    'Over-the-Shoulder'
  ];
  
  export const LIGHTING_OPTIONS = [
    'Natural', 
    'Dramatic', 
    'Soft', 
    'Hard', 
    'Backlit', 
    'Silhouette'
  ];
  
  export const MOOD_OPTIONS = [
    'Happy', 
    'Sad', 
    'Tense', 
    'Peaceful', 
    'Epic', 
    'Mysterious', 
    'Romantic'
  ];
  
  export const COMPOSITION_OPTIONS = [
    'Rule of Thirds', 
    'Centered', 
    'Symmetrical', 
    'Leading Lines', 
    'Frame within Frame'
  ];
  
  export const DEFAULT_SCENE_DATA = {
    prompt: '',
    aspectRatio: ASPECT_RATIOS[0],
    shotType: SHOT_TYPES[0],
    shotSize: SHOT_SIZES[2],
    shotAngle: SHOT_ANGLES[0],
    lighting: LIGHTING_OPTIONS[0],
    mood: MOOD_OPTIONS[0],
    composition: COMPOSITION_OPTIONS[0],
    characters: []
  };