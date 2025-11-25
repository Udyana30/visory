import { ComicPage, ComicPanel, SpeechBubble } from '../types/editor';
import { PageElement } from '@/services/comic/comicPageService';
import { PANEL_LAYOUTS } from './editorConstants';

const POSITION_TOLERANCE = 5;

type LayoutType = 'single' | 'double' | 'triple' | 'quad';

const isPositionMatch = (actual: number, expected: number): boolean => {
  return Math.abs(actual - expected) <= POSITION_TOLERANCE;
};

const sortPanelsByPosition = (panels: ComicPanel[] | typeof PANEL_LAYOUTS.single) => {
  return [...panels].sort((a, b) => {
    const yDiff = a.y - b.y;
    if (Math.abs(yDiff) > POSITION_TOLERANCE) return yDiff;
    return a.x - b.x;
  });
};

const isPanelMatchingTemplate = (
  panel: { x: number; y: number; width: number; height: number },
  template: { x: number; y: number; width: number; height: number }
): boolean => {
  return (
    isPositionMatch(panel.x, template.x) &&
    isPositionMatch(panel.y, template.y) &&
    isPositionMatch(panel.width, template.width) &&
    isPositionMatch(panel.height, template.height)
  );
};

const detectLayoutFromPanels = (panels: ComicPanel[]): ComicPage['layout'] => {
  if (panels.length === 0) return 'single';
  if (panels.length > 4) return 'custom';

  const layoutKeys: LayoutType[] = ['single', 'double', 'triple', 'quad'];
  
  for (const layoutKey of layoutKeys) {
    const template = PANEL_LAYOUTS[layoutKey];
    
    if (template.length !== panels.length) continue;

    const sortedPanels = sortPanelsByPosition(panels);
    const sortedTemplate = sortPanelsByPosition(template);

    const allMatch = sortedPanels.every((panel, index) => 
      isPanelMatchingTemplate(panel, sortedTemplate[index])
    );

    if (allMatch) return layoutKey;
  }

  return 'custom';
};

const createBubbleElement = (bubble: SpeechBubble, layerIndex: number): PageElement => ({
  id: bubble.id,
  type: 'speech_bubble',
  text: bubble.text || '',
  position: {
    x: Math.round(bubble.x),
    y: Math.round(bubble.y),
  },
  size: {
    width: Math.round(bubble.width),
    height: Math.round(bubble.height),
  },
  style: {
    font_size: bubble.fontSize,
    color: bubble.color,
    font_family: bubble.fontFamily,
    background_color: bubble.backgroundColor,
    border_color: bubble.borderColor,
    border_width: bubble.borderWidth,
    text_align: bubble.textAlign,
    border_radius: 12,
  },
  layer_index: layerIndex,
});

const createPanelElement = (panel: ComicPanel, layerIndex: number): PageElement => {
  const element: PageElement = {
    id: panel.id,
    type: 'panel',
    position: {
      x: Math.round(panel.x),
      y: Math.round(panel.y),
    },
    size: {
      width: Math.round(panel.width),
      height: Math.round(panel.height),
    },
    image: panel.imageUrl,
    layer_index: layerIndex,
  };

  if (panel.rotation && panel.rotation !== 0) {
    element.rotation = panel.rotation;
  }

  return element;
};

export const serializePageToAPI = (page: ComicPage): PageElement[] => {
  const elements: PageElement[] = [];
  let layerIndex = 0;

  const validPanels = page.panels.filter(
    panel => panel.imageUrl && panel.imageUrl.trim() !== ''
  );

  validPanels.forEach((panel) => {
    elements.push(createPanelElement(panel, layerIndex++));
  });

  if (page.bubbles) {
    page.bubbles.forEach((bubble) => {
      elements.push(createBubbleElement(bubble, layerIndex++));
    });
  }

  return elements;
};

const createSpeechBubble = (bubbleEl: PageElement): SpeechBubble => ({
  id: bubbleEl.id,
  type: (bubbleEl.style?.font_family?.toLowerCase().includes('bold')
    ? 'shout'
    : 'speech') as SpeechBubble['type'],
  text: bubbleEl.text || '',
  x: bubbleEl.position.x,
  y: bubbleEl.position.y,
  width: bubbleEl.size?.width || 20,
  height: bubbleEl.size?.height || 15,
  fontSize: bubbleEl.style?.font_size || 16,
  fontFamily: bubbleEl.style?.font_family || 'Comic Sans MS',
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: 'none',
  textAlign: (bubbleEl.style?.text_align as 'left' | 'center' | 'right') || 'center',
  color: bubbleEl.style?.color || '#000000',
  backgroundColor: bubbleEl.style?.background_color || '#ffffff',
  borderColor: bubbleEl.style?.border_color || '#000000',
  borderWidth: bubbleEl.style?.border_width || 2,
  showTail: true
});

const createComicPanel = (panelEl: PageElement): ComicPanel => {
  return {
    id: panelEl.id,
    imageUrl: panelEl.image || '',
    x: panelEl.position.x,
    y: panelEl.position.y,
    width: panelEl.size?.width || 100,
    height: panelEl.size?.height || 100,
    rotation: panelEl.rotation || 0,
  };
};

export const deserializePageFromAPI = (
  elements: PageElement[],
  pageId: number,
  pageNumber: number,
  previewUrl?: string | null
): ComicPage => {
  const panelElements = elements.filter((el) => el.type === 'panel');
  const bubbleElements = elements.filter((el) => el.type === 'speech_bubble');

  const panels = panelElements.map((panelEl) => 
    createComicPanel(panelEl)
  );

  const bubbles = bubbleElements.map(createSpeechBubble);

  const detectedLayout = detectLayoutFromPanels(panels);

  return {
    id: pageId,
    page_number: pageNumber,
    layout: detectedLayout,
    backgroundColor: '#ffffff',
    panels,
    bubbles,
    preview_url: previewUrl
  };
};