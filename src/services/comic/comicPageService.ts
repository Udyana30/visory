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

export interface PageData {
  id: number;
  project_id: number;
  page_number: number;
  notes: string;
  elements: PageElement[];
  preview_url: string | null;
  is_thumbnail: boolean;
  created_at: string;
  updated_at: string;
}

export interface GetPagesResponse {
  data: PageData[];
  total: number;
}

export interface CreatePageRequest {
  notes?: string;
}

export interface UpdatePageRequest {
  page_number?: number;
  notes?: string;
  elements?: PageElement[];
  is_thumbnail?: boolean;
}

export interface SavePageRequest {
  elements: PageElement[];
  is_thumbnail?: boolean;
}

export interface DeletePageRequest {
  page_number?: number;
  notes?: string;
}

export interface SavePageResponse {
  detail: string;
}

export interface UpdatePageResponse {
  id: number;
  project_id: number;
  page_number: number;
  notes: string;
  elements: PageElement[];
  thumbnail_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DeletePageResponse {
  detail: string;
}

export const comicPageService = {
  getPages: async (projectId: number): Promise<GetPagesResponse> => {
    const response = await apiClient.get<GetPagesResponse>(
      `/service/comic/projects/${projectId}/pages`
    );
    return response.data;
  },

  createPage: async (
    projectId: number,
    data: CreatePageRequest
  ): Promise<PageData> => {
    const response = await apiClient.post<PageData>(
      `/service/comic/projects/${projectId}/pages`,
      data
    );
    return response.data;
  },

  loadPage: async (
    projectId: number,
    pageId: number 
  ): Promise<PageData> => {
    const response = await apiClient.get<PageData>(
      `/service/comic/projects/${projectId}/pages/${pageId}`
    );
    return response.data;
  },

  updatePage: async (
    projectId: number,
    pageId: number,
    data: UpdatePageRequest
  ): Promise<UpdatePageResponse> => {
    const response = await apiClient.put<UpdatePageResponse>(
      `/service/comic/projects/${projectId}/pages/${pageId}`,
      data
    );
    return response.data;
  },

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

  deletePage: async (
    projectId: number,
    pageId: number,
    data?: DeletePageRequest
  ): Promise<DeletePageResponse> => {
    const response = await apiClient.delete<DeletePageResponse>(
      `/service/comic/projects/${projectId}/pages/${pageId}`,
      { data }
    );
    return response.data;
  },
};