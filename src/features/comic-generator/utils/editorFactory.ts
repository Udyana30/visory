import { ComicPage, ComicPanel, SpeechBubble, PageLayout } from '../types/domain/editor';
import { PANEL_LAYOUTS } from '../constants/editor';

export const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
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
  imageUrl: undefined,
  imageScale: 1,
  imagePosition: { x: 50, y: 50 },
  isCustom: false
});

export const createDefaultBubble = (x: number, y: number, zIndex: number): SpeechBubble => ({
  id: generateId(),
  type: 'bubble',
  variant: 'speech',
  text: 'Double click to edit',
  x,
  y,
  width: 25,
  height: 15,
  rotation: 0,
  zIndex,
  style: {
    fontSize: 14,
    fontFamily: 'Comic Sans MS',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'center',
    color: '#000000',
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    borderWidth: 2,
    showTail: true
  }
});

export const generatePanelsFromLayout = (layout: PageLayout): ComicPanel[] => {
  if (layout === 'custom') return [];
  
  const layoutConfig = PANEL_LAYOUTS[layout] || PANEL_LAYOUTS.single;
  
  return layoutConfig.map((config, index) => ({
    ...createDefaultPanel(index),
    x: config.x,
    y: config.y,
    width: config.width,
    height: config.height,
    isCustom: false
  }));
};

export const createInitialPage = (pageNumber: number): ComicPage => {
  return {
    id: generateId(),
    pageNumber,
    layout: 'single',
    backgroundColor: '#ffffff',
    elements: generatePanelsFromLayout('single'),
    isDirty: true
  };
};