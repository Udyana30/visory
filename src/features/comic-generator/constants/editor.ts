import { BubbleTemplate } from '../types/domain/editor';

export const DEFAULT_PAGE_WIDTH = 800;
export const DEFAULT_PAGE_HEIGHT = 1200;

export const FONT_FAMILIES = [
  'Comic Sans MS', 'Arial', 'Helvetica', 'Times New Roman', 
  'Courier New', 'Bangers', 'Permanent Marker', 'Impact'
];

export const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48];

export const PANEL_LAYOUTS = {
  single: [{ x: 0, y: 0, width: 100, height: 100 }],
  double: [
    { x: 0, y: 0, width: 100, height: 48 },
    { x: 0, y: 52, width: 100, height: 48 }
  ],
  triple: [
    { x: 0, y: 0, width: 100, height: 30 },
    { x: 0, y: 33, width: 100, height: 30 },
    { x: 0, y: 66, width: 100, height: 30 }
  ],
  quad: [
    { x: 0, y: 0, width: 48, height: 48 },
    { x: 52, y: 0, width: 48, height: 48 },
    { x: 0, y: 52, width: 48, height: 48 },
    { x: 52, y: 52, width: 48, height: 48 }
  ]
};

export const DEFAULT_BUBBLE_STYLE = {
  fontSize: 16,
  fontFamily: 'Comic Sans MS',
  fontWeight: 'normal' as const,
  fontStyle: 'normal' as const,
  textDecoration: 'none' as const,
  textAlign: 'center' as const,
  color: '#000000',
  backgroundColor: '#ffffff',
  borderColor: '#000000',
  borderWidth: 2,
  showTail: true
};

export const BUBBLE_TEMPLATES: BubbleTemplate[] = [
  {
    id: 'classic-speech',
    name: 'Classic Speech',
    icon: '💬',
    preview: 'Rounded speech bubble',
    style: {
      type: 'speech',
      backgroundColor: '#ffffff',
      borderColor: '#000000',
      borderWidth: 2,
      color: '#000000',
      fontSize: 16,
      fontFamily: 'Comic Sans MS',
      showTail: true
    }
  },
  {
    id: 'thought',
    name: 'Thought',
    icon: '💭',
    preview: 'Cloud thought bubble',
    style: {
      type: 'thought',
      backgroundColor: '#f0f0f0',
      borderColor: '#666666',
      borderWidth: 2,
      color: '#333333',
      fontSize: 14,
      fontFamily: 'Arial',
      showTail: true
    }
  },
  {
    id: 'shout',
    name: 'Shout',
    icon: '📢',
    preview: 'Bold shout bubble',
    style: {
      type: 'shout',
      backgroundColor: '#fff3cd',
      borderColor: '#000000',
      borderWidth: 4,
      color: '#000000',
      fontSize: 20,
      fontFamily: 'Bangers',
      showTail: true
    }
  },
  {
    id: 'whisper',
    name: 'Whisper',
    icon: '🤫',
    preview: 'Dashed whisper bubble',
    style: {
      type: 'whisper',
      backgroundColor: '#e8f4f8',
      borderColor: '#4a90a4',
      borderWidth: 1,
      color: '#2c5f75',
      fontSize: 12,
      fontFamily: 'Arial',
      showTail: false
    }
  },
  {
    id: 'narration',
    name: 'Narration',
    icon: '📝',
    preview: 'Rectangular caption box',
    style: {
      type: 'narration',
      backgroundColor: '#ffe4b3',
      borderColor: '#8b6914',
      borderWidth: 2,
      color: '#000000',
      fontSize: 14,
      fontFamily: 'Times New Roman',
      showTail: false
    }
  }
];