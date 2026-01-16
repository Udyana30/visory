import apiClient from '@/lib/apiClient';
import {
  CreateSceneRequest,
  SceneResponse,
  SceneListResponse,
  GenerationHistoryItem
} from '../types/api/scene';

// Scene Service untuk mengelola operasi CRUD scene
export const sceneService = {
  // Create new scene
  create: async (data: CreateSceneRequest): Promise<SceneResponse> => {
    const response = await apiClient.post<SceneResponse>('/service/comic/scenes', data);
    return response.data;
  },

  // Get all scenes for a project (with pagination support)
  getAll: async (projectId: number, page: number = 1, limit: number = 100): Promise<SceneResponse[]> => {
    const response = await apiClient.get<SceneListResponse>('/service/comic/scenes/', {
      params: {
        project_id: projectId,
        page,
        limit
      }
    });

    // Extract data from paginated response
    return response.data.data || [];
  },

  // Get scene by ID
  getById: async (id: number): Promise<SceneResponse> => {
    const response = await apiClient.get<SceneResponse>(`/service/comic/scenes/${id}`);
    return response.data;
  },

  // Update existing scene
  update: async (id: number, data: CreateSceneRequest): Promise<SceneResponse> => {
    const response = await apiClient.put<SceneResponse>(`/service/comic/scenes/${id}`, data);
    return response.data;
  },

  // Get generation history
  getHistory: async (id: number): Promise<GenerationHistoryItem[]> => {
    const response = await apiClient.get<GenerationHistoryItem[]>(`/service/comic/scenes/history/${id}`);
    return response.data;
  },

  // Delete scene
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/service/comic/scenes/${id}`);
  },

  // Upload custom scene from local file
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

// Export individual functions for better tree-shaking (optional)
export const {
  create,
  getAll,
  getById,
  update,
  getHistory,
  delete: deleteScene,
  uploadCustomScene
} = sceneService;