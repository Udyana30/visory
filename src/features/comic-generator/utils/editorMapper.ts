import { ComicPage, ComicPanel, SpeechBubble } from '../types/domain/editor';
import { PageResponse, SavePageRequest, ApiElement } from '../types/api/page';
import { generateId } from './editorFactory';
import { inferLayoutFromPanels } from './layoutInference';

export const mapApiToDomain = (apiPage: PageResponse): ComicPage => {
  const elements: (ComicPanel | SpeechBubble)[] = (apiPage.elements || []).map((el) => {
    const base = {
      id: el.id || generateId(),
      x: el.position.x,
      y: el.position.y,
      width: el.size.width,
      height: el.size.height,
      rotation: el.rotation,
      zIndex: el.layer_index,
    };

    if (el.type === 'panel') {
      return {
        ...base,
        type: 'panel',
        imageUrl: el.image_url,
        imageScale: el.properties?.scale || 1,
        imagePosition: el.properties?.position || { x: 50, y: 50 },
        isCustom: el.properties?.is_custom || false,
      } as ComicPanel;
    } 
    
    return {
      ...base,
      type: 'bubble',
      variant: el.properties?.variant || 'speech',
      text: el.text_content || '',
      style: el.properties?.style || {}
    } as SpeechBubble;
  });

  const sortedElements = elements.sort((a, b) => a.zIndex - b.zIndex);
  const panels = sortedElements.filter((el): el is ComicPanel => el.type === 'panel');
  
  const detectedLayout = inferLayoutFromPanels(panels);

  return {
    id: apiPage.id.toString(),
    pageNumber: apiPage.page_number,
    layout: detectedLayout,
    backgroundColor: apiPage.background_color || '#ffffff',
    previewUrl: apiPage.preview_url || undefined,
    elements: sortedElements,
    isDirty: false
  };
};

export const mapDomainToApi = (page: ComicPage): SavePageRequest => {
  const elements: ApiElement[] = page.elements.map((el, index) => {
    const isPanel = el.type === 'panel';
    const panel = el as ComicPanel;
    const bubble = el as SpeechBubble;

    return {
      id: isNaN(Number(el.id)) ? undefined : el.id,
      type: el.type === 'bubble' ? 'speech_bubble' : 'panel',
      position: { x: el.x, y: el.y },
      size: { width: el.width, height: el.height },
      rotation: el.rotation,
      layer_index: index,
      image_url: isPanel ? panel.imageUrl : undefined,
      text_content: !isPanel ? bubble.text : undefined,
      properties: isPanel 
        ? { scale: panel.imageScale, position: panel.imagePosition, is_custom: panel.isCustom }
        : { variant: bubble.variant, style: bubble.style }
    };
  });

  return {
    page_number: page.pageNumber,
    layout: page.layout,
    background_color: page.backgroundColor,
    elements,
  };
};