import { ComicPage, ComicPanel, SpeechBubble, PageLayout } from '../types/domain/editor';
import { PANEL_LAYOUTS, DEFAULT_BUBBLE_STYLE } from '../constants/editor';

export const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15);
};

export const createDefaultPanel = (index: number = 0): ComicPanel => ({
  id: generateId(),
  type: 'panel',
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  rotation: 0,
  zIndex: index,
  imageUrl: '',
  imageScale: 1,
  imagePosition: { x: 50, y: 50 },
  isCustom: false
});

export const createDefaultBubble = (x: number, y: number, zIndex: number): SpeechBubble => ({
  id: generateId(),
  type: 'bubble',
  variant: 'speech',
  text: 'Double click to edit',
  x: Math.max(0, Math.min(80, x)),
  y: Math.max(0, Math.min(80, y)),
  width: 20,
  height: 15,
  rotation: 0,
  zIndex,
  style: { ...DEFAULT_BUBBLE_STYLE }
});

export const createEmptyPage = (pageNumber: number, layout: PageLayout = 'single'): ComicPage => {
  let elements: (ComicPanel | SpeechBubble)[] = [];
  
  if (layout !== 'custom' && PANEL_LAYOUTS[layout as keyof typeof PANEL_LAYOUTS]) {
    const config = PANEL_LAYOUTS[layout as keyof typeof PANEL_LAYOUTS];
    elements = config.map((cfg: any, index: number) => ({
      ...createDefaultPanel(index),
      x: cfg.x,
      y: cfg.y,
      width: cfg.width,
      height: cfg.height
    }));
  }

  return {
    id: generateId(),
    pageNumber,
    layout,
    elements,
    backgroundColor: '#ffffff',
    isDirty: true
  };
};