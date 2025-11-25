import apiClient from '@/lib/apiClient';
import { 
  CreateReferenceRequest, 
  ReferenceResponse 
} from '../types/api/reference';
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
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  getAll: async (projectId: number): Promise<ReferenceResponse[]> => {
    const response = await apiClient.get<ReferenceResponse[] | ApiResponseWrapper<ReferenceResponse[]>>(
      '/service/comic/references/',
      { params: { project_id: projectId } }
    );

    if (Array.isArray(response.data)) {
      return response.data;
    }

    if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    return [];
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/service/comic/references/${id}`);
  }
};