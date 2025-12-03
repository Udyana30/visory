import apiClient from '@/lib/apiClient';
import { CreateReferenceRequest, ReferenceResponse } from '../types/api/reference';
import { ApiResponseWrapper } from '../types/common';

export const referenceService = {
  create: async (data: CreateReferenceRequest): Promise<ReferenceResponse> => {
    const response = await apiClient.post<ReferenceResponse>('/service/comic/references/', data);
    return response.data;
  },

  createCustom: async (projectId: number, file: File, type: 'character' | 'background'): Promise<ReferenceResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const response = await apiClient.post<ReferenceResponse>(
      `/service/comic/references/custom/${projectId}`, 
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  getAllByProject: async (projectId: number): Promise<ReferenceResponse[]> => {
    const response = await apiClient.get<ReferenceResponse[] | ApiResponseWrapper<ReferenceResponse[]>>(
      '/service/comic/references/',
      { params: { project_id: projectId } }
    );
    return Array.isArray(response.data) ? response.data : response.data?.data || [];
  },

  getUserLibrary: async (userId: number): Promise<ReferenceResponse[]> => {
    const response = await apiClient.get<ReferenceResponse[] | ApiResponseWrapper<ReferenceResponse[]>>(
      '/service/comic/references/',
      { params: { user_id: userId } }
    );
    return Array.isArray(response.data) ? response.data : response.data?.data || [];
  },

  getById: async (id: number): Promise<ReferenceResponse> => {
    const response = await apiClient.get<ReferenceResponse>(`/service/comic/references/${id}`);
    return response.data;
  },

  update: async (id: number, data: CreateReferenceRequest): Promise<ReferenceResponse> => {
    const response = await apiClient.put<ReferenceResponse>(`/service/comic/references/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/service/comic/references/${id}`);
  },

  //NOT IMPLEMENTED YET
  assignToProject: async (referenceId: number, projectId: number): Promise<void> => {
    await apiClient.post(`/service/comic/references/${referenceId}/assign`, { project_id: projectId });
  }
};