import apiClient from '@/lib/apiClient';

export interface PageElement {
  id: string;
  type: 'panel' | 'speech_bubble' | 'text';
  position: {
    x: number;
    y: number;
  };
  size?: {
    width: number;
    height: number;
  };
  image?: string;
  text?: string;
  scale?: number;
  rotation?: number;
  layer_index: number;
  style?: {
    font_size?: number;
    color?: string;
    font_family?: string;
    background_color?: string;
    border_color?: string;
    border_width?: number;
    border_radius?: number;
    text_align?: string;
  };
}

export interface SavePageRequest {
  elements: PageElement[];
}

export interface SavePageResponse {
  detail: string;
}

export const comicPageService = {
  savePage: async (
    projectId: number,
    pageId: number,
    data: SavePageRequest
  ): Promise<SavePageResponse> => {
    const response = await apiClient.post<SavePageResponse>(
      `/service/comic/projects/${projectId}/pages/${pageId}/save`,
      data
    );
    return response.data;
  },

  loadPage: async (
    projectId: number,
    pageId: number
  ): Promise<SavePageRequest> => {
    const response = await apiClient.get<SavePageRequest>(
      `/service/comic/projects/${projectId}/pages/${pageId}`
    );
    return response.data;
  },
};