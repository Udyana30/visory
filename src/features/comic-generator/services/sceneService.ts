import apiClient from '@/lib/apiClient';
import { 
  CreateSceneRequest, 
  SceneResponse 
} from '../types/api/scene';

export const sceneService = {
  create: async (data: CreateSceneRequest): Promise<SceneResponse> => {
    const response = await apiClient.post<SceneResponse>('/service/comic/scenes/', data);
    return response.data;
  },

  update: async (id: number, data: CreateSceneRequest): Promise<SceneResponse> => {
    const response = await apiClient.put<SceneResponse>(
      `/service/comic/scenes/${id}`, 
      data
    );
    return response.data;
  },

  getAll: async (projectId: number): Promise<SceneResponse[]> => {
    const response = await apiClient.get<any>(
      '/service/comic/scenes/',
      { params: { project_id: projectId } }
    );

    if (response.data?.scenes && Array.isArray(response.data.scenes)) {
      return response.data.scenes;
    }

    if (Array.isArray(response.data)) {
      return response.data;
    }

    if (response.data?.data?.scenes && Array.isArray(response.data.data.scenes)) {
      return response.data.data.scenes;
    }

    if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    return [];
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/service/comic/scenes/${id}`);
  }
};