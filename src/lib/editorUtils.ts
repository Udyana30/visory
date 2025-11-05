import { ComicPage, ComicPanel, SpeechBubble } from '@/types/editor';
import { PANEL_LAYOUTS } from './editorConstants';

export const createDefaultBubble = (x: number, y: number): SpeechBubble => ({
  id: `bubble-${Date.now()}`,
  type: 'speech',
  text: '',
  x: Math.max(0, Math.min(75, x - 10)),
  y: Math.max(0, Math.min(75, y - 10)),
  width: 20,
  height: 15,
  fontSize: 16,
  fontFamily: 'Comic Sans MS',
  textAlign: 'center',
  color: '#000000',
  backgroundColor: '#ffffff',
  borderColor: '#000000',
  borderWidth: 2
});

export const createEmptyPanel = (index: number): ComicPanel => ({
  id: `panel-${Date.now()}-${index}`,
  imageUrl: '',
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  rotation: 0,
  bubbles: []
});

export const createEmptyPage = (): ComicPage => ({
  id: `page-${Date.now()}`,
  layout: 'single',
  backgroundColor: '#ffffff',
  panels: [createEmptyPanel(0)]
});

export const createPanelsFromLayout = (
  layout: string,
  existingPanels: ComicPanel[]
): ComicPanel[] => {
  const layoutConfig = PANEL_LAYOUTS[layout as keyof typeof PANEL_LAYOUTS];
  if (!layoutConfig) return existingPanels;

  return layoutConfig.map((config, index) => ({
    id: `panel-${Date.now()}-${index}`,
    imageUrl: index < existingPanels.length ? existingPanels[index].imageUrl : '',
    x: config.x,
    y: config.y,
    width: config.width,
    height: config.height,
    rotation: 0,
    bubbles: index < existingPanels.length ? existingPanels[index].bubbles : []
  }));
};

export const clonePages = (pages: ComicPage[]): ComicPage[] => {
  return JSON.parse(JSON.stringify(pages));
};

export const findBubbleInPage = (
  page: ComicPage,
  bubbleId: string
): { panel: ComicPanel; bubble: SpeechBubble } | null => {
  for (const panel of page.panels) {
    const bubble = panel.bubbles.find(b => b.id === bubbleId);
    if (bubble) return { panel, bubble };
  }
  return null;
};