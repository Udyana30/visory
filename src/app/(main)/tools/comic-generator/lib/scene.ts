export const ASPECT_RATIOS = [
  'Square (1:1)', 
  'Portrait (9:16)', 
  'Landscape (16:9)', 
  'Portrait (3:4)', 
  'Landscape (4:3)'
];

export const SHOT_TYPES = [
  'Auto',
  'Front View', 
  'Side View', 
  'Back View'
];

export const SHOT_SIZES = [
  'Auto',
  'Close-Up', 
  'Medium Shot', 
  'Full Body'
];

export const SHOT_ANGLES = [
  'Auto',
  'Eye Level', 
  'Above', 
  'Below'
];

export const LIGHTING_OPTIONS = [
  'Auto',
  'Natural', 
  'Dramatic', 
  'Dim'
];

export const MOOD_OPTIONS = [
  'Auto',
  'Happy', 
  'Sad', 
  'Epic', 
  'Neutral'
];

export const COMPOSITION_OPTIONS = [
  'Auto',
  'Symmetric', 
  'Rule of Thirds', 
  'Centered'
];

export const DEFAULT_SCENE_DATA = {
  prompt: '',
  aspectRatio: ASPECT_RATIOS[2],
  shotType: SHOT_TYPES[0],
  shotSize: SHOT_SIZES[0],
  shotAngle: SHOT_ANGLES[0],
  lighting: LIGHTING_OPTIONS[0],
  mood: MOOD_OPTIONS[0],
  composition: COMPOSITION_OPTIONS[0],
  characters: []
};