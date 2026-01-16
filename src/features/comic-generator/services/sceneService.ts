import apiClient from '@/lib/apiClient';
import {
  CreateSceneRequest,
  SceneResponse,
  SceneListResponse,
  GenerationHistoryItem
} from '../types/api/scene';

export const sceneService = {
  create: async (data: CreateSceneRequest): Promise<SceneResponse> => {
    const response = await apiClient.post<SceneResponse>('/service/comic/scenes', data);
    return response.data;
  },

  getAll: async (projectId: number): Promise<SceneResponse[]> => {
    const response = await apiClient.get<SceneListResponse>('/service/comic/scenes/', {
      params: { project_id: projectId }
    });
    return response.data.scenes || [];
  },

  getById: async (id: number): Promise<SceneResponse> => {
    const response = await apiClient.get<SceneResponse>(`/service/comic/scenes/${id}`);
    return response.data;
  },

  update: async (id: number, data: CreateSceneRequest): Promise<SceneResponse> => {
    const response = await apiClient.put<SceneResponse>(`/service/comic/scenes/${id}`, data);
    return response.data;
  },

  getHistory: async (id: number): Promise<GenerationHistoryItem[]> => {
    const response = await apiClient.get<GenerationHistoryItem[]>(`/service/comic/scenes/history/${id}`);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/service/comic/scenes/${id}`);
  },

  uploadCustomScene: async (projectId: number, file: File): Promise<SceneResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<SceneResponse>(
      `/service/comic/scenes/custom/${projectId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }
};

export const {
  create,
  getAll,
  getById,
  update,
  getHistory,
  delete: deleteScene,
  uploadCustomScene
} = sceneService;