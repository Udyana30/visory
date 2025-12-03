import apiClient from '@/lib/apiClient';
import { ComicPage } from '../types/domain/editor';
import { PageResponse, PageListResponse, CreatePageRequest, UpdatePageRequest } from '../types/api/page';
import { mapApiToDomain, mapDomainToApi } from '../utils/editorMapper';

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

  updatePageDetails: async (projectId: number, pageId: string, data: UpdatePageRequest): Promise<void> => {
    if (isNaN(Number(pageId))) return;
    await apiClient.put(`/service/comic/projects/${projectId}/pages/${pageId}`, data);
  },

  deletePage: async (projectId: number, pageId: string): Promise<void> => {
    if (isNaN(Number(pageId))) return;
    await apiClient.delete(`/service/comic/projects/${projectId}/pages/${pageId}`);
  },

  updatePageOrder: async (projectId: number, pages: ComicPage[]): Promise<void> => {
    const updatePromises = pages.map((page, index) => {
      const newPageNumber = index + 1;
      return editorService.updatePageDetails(projectId, page.id, {
        page_number: newPageNumber
      });
    });

    try {
      await Promise.all(updatePromises);
    } catch (error) {
      throw error;
    }
  }
};