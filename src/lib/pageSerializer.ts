import { ComicPage, ComicPanel, SpeechBubble } from '@/types/editor';
import { PageElement } from '@/services/comicPageService';

export const serializePageToAPI = (page: ComicPage): PageElement[] => {
  const elements: PageElement[] = [];
  let layerIndex = 0;

  page.panels.forEach((panel) => {
    const panelElement: PageElement = {
      id: panel.id,
      type: 'panel',
      position: {
        x: panel.x,
        y: panel.y,
      },
      size: {
        width: panel.width,
        height: panel.height,
      },
      image: panel.imageUrl || undefined,
      rotation: panel.rotation,
      layer_index: layerIndex++,
    };

    elements.push(panelElement);

    panel.bubbles.forEach((bubble) => {
      const bubbleElement: PageElement = {
        id: bubble.id,
        type: 'speech_bubble',
        text: bubble.text,
        position: {
          x: bubble.x,
          y: bubble.y,
        },
        size: {
          width: bubble.width,
          height: bubble.height,
        },
        style: {
          font_size: bubble.fontSize,
          color: bubble.color,
          font_family: bubble.fontFamily,
          background_color: bubble.backgroundColor,
          border_color: bubble.borderColor,
          border_width: bubble.borderWidth,
          text_align: bubble.textAlign,
        },
        layer_index: layerIndex++,
      };

      elements.push(bubbleElement);
    });
  });

  return elements;
};

export const deserializePageFromAPI = (
  elements: PageElement[],
  pageId: string,
  layout: string
): ComicPage => {
  const panelElements = elements.filter((el) => el.type === 'panel');
  const bubbleElements = elements.filter((el) => el.type === 'speech_bubble');

  const panels: ComicPanel[] = panelElements.map((panelEl) => {
    const panelBubbles = bubbleElements
      .filter((bubbleEl) => {
        const panelBounds = {
          x1: panelEl.position.x,
          y1: panelEl.position.y,
          x2: panelEl.position.x + (panelEl.size?.width || 0),
          y2: panelEl.position.y + (panelEl.size?.height || 0),
        };

        const bubbleX = bubbleEl.position.x;
        const bubbleY = bubbleEl.position.y;

        return (
          bubbleX >= panelBounds.x1 &&
          bubbleX <= panelBounds.x2 &&
          bubbleY >= panelBounds.y1 &&
          bubbleY <= panelBounds.y2
        );
      })
      .map((bubbleEl): SpeechBubble => ({
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
        textAlign: (bubbleEl.style?.text_align as 'left' | 'center' | 'right') || 'center',
        color: bubbleEl.style?.color || '#000000',
        backgroundColor: bubbleEl.style?.background_color || '#ffffff',
        borderColor: bubbleEl.style?.border_color || '#000000',
        borderWidth: bubbleEl.style?.border_width || 2,
      }));

    return {
      id: panelEl.id,
      imageUrl: panelEl.image || '',
      x: panelEl.position.x,
      y: panelEl.position.y,
      width: panelEl.size?.width || 100,
      height: panelEl.size?.height || 100,
      rotation: panelEl.rotation || 0,
      bubbles: panelBubbles,
    };
  });

  return {
    id: pageId,
    layout: layout as ComicPage['layout'],
    backgroundColor: '#ffffff',
    panels,
  };
};