import apiClient from '@/lib/apiClient';
import {
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectResponse,
  ComicListResponse
} from '../types/api/project';
import { PaginationParams } from '../../../types/common';

export const projectService = {
  create: async (data: CreateProjectRequest): Promise<ProjectResponse> => {
    const response = await apiClient.post<ProjectResponse>('/service/comic/projects/', data);
    return response.data;
  },

  getAll: async (params?: PaginationParams): Promise<ComicListResponse> => {
    const response = await apiClient.get<ComicListResponse>('/service/comic/projects/', {
      params
    });
    return response.data;
  },

  getById: async (id: number): Promise<ProjectResponse> => {
    const response = await apiClient.get<ProjectResponse>(`/service/comic/projects/${id}`);
    return response.data;
  },

  update: async (id: number, data: UpdateProjectRequest): Promise<ProjectResponse> => {
    const response = await apiClient.put<ProjectResponse>(`/service/comic/projects/${id}`, data);
    return response.data;
  },

  // Set project as public (for gallery display)
  setPublic: async (id: number, isPublic: boolean): Promise<ProjectResponse> => {
    const response = await apiClient.put<ProjectResponse>(`/service/comic/projects/${id}`, {
      is_public: isPublic
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/service/comic/projects/${id}`);
  }
};