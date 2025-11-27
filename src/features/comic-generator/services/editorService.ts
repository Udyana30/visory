import apiClient from '@/lib/apiClient';
import { ComicPage, ComicPanel, SpeechBubble } from '../types/domain/editor';
import { PageResponse, SavePageRequest, ApiElement, PageListResponse, CreatePageRequest } from '../types/api/page';
import { generateId } from '../utils/editorFactory';

const mapApiToDomain = (apiPage: PageResponse): ComicPage => {
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

  return {
    id: apiPage.id.toString(),
    pageNumber: apiPage.page_number,
    layout: (apiPage.layout as any) || 'single',
    backgroundColor: apiPage.background_color || '#ffffff',
    previewUrl: apiPage.preview_url || undefined,
    elements: elements.sort((a, b) => a.zIndex - b.zIndex),
    isDirty: false
  };
};

const mapDomainToApi = (page: ComicPage): SavePageRequest => {
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

export const editorService = {
  getPages: async (projectId: number): Promise<ComicPage[]> => {
    const response = await apiClient.get<PageListResponse>(`/service/comic/projects/${projectId}/pages`);
    if (!response.data.data) return [];
    return response.data.data.map(mapApiToDomain);
  },

  createPage: async (projectId: number, data: CreatePageRequest): Promise<ComicPage> => {
    const response = await apiClient.post<PageResponse>(`/service/comic/projects/${projectId}/pages`, data);
    return mapApiToDomain(response.data);
  },

  savePage: async (projectId: number, page: ComicPage): Promise<void> => {
    const data = mapDomainToApi(page);
    if (isNaN(Number(page.id))) return; 
    await apiClient.post(`/service/comic/projects/${projectId}/pages/${page.id}/save`, data);
  },

  deletePage: async (projectId: number, pageId: string): Promise<void> => {
    if (isNaN(Number(pageId))) return;
    await apiClient.delete(`/service/comic/projects/${projectId}/pages/${pageId}`);
  },

  updatePageOrder: async (projectId: number, pageIds: string[]): Promise<void> => {
    const numericIds = pageIds.map(Number).filter(n => !isNaN(n));
    await apiClient.put(`/service/comic/projects/${projectId}/pages/reorder`, {
      page_ids: numericIds
    });
  }
};