import apiClient from '@/lib/apiClient';
import {
  CreateProjectRequest,
  ProjectResponse,
  CreateCharacterRequest,
  CharacterResponse,
  CreateSceneRequest,
  SceneResponse,
  ComicListResponse
} from '@/types/comic';

interface ApiResponseWrapper<T> {
  data?: T;
}

export const comicService = {
  createProject: async (data: CreateProjectRequest): Promise<ProjectResponse> => {
    const response = await apiClient.post<ProjectResponse>('/service/comic/projects/', data);
    return response.data;
  },

  getProjects: async (params?: { page?: number; limit?: number }): Promise<ComicListResponse> => {
    const response = await apiClient.get<ComicListResponse>('/service/comic/projects/', {
      params
    });
    return response.data;
  },

  getProjectById: async (id: number): Promise<ProjectResponse> => {
    const response = await apiClient.get<ProjectResponse>(`/service/comic/projects/${id}`);
    return response.data;
  },

  updateProject: async (id: number, data: Partial<CreateProjectRequest>): Promise<ProjectResponse> => {
    const response = await apiClient.put<ProjectResponse>(`/service/comic/projects/${id}`, data);
    return response.data;
  },

  deleteProject: async (id: number): Promise<void> => {
    await apiClient.delete(`/service/comic/projects/${id}`);
  },

  createCharacter: async (data: CreateCharacterRequest): Promise<CharacterResponse> => {
    const response = await apiClient.post<CharacterResponse>('/service/comic/references/', data);
    return response.data;
  },

  createCustomCharacter: async (projectId: number, file: File): Promise<CharacterResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<CharacterResponse>(
      `/service/comic/references/custom/${projectId}`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  getCharacters: async (projectId: number): Promise<CharacterResponse[]> => {
    const response = await apiClient.get<CharacterResponse[] | ApiResponseWrapper<CharacterResponse[]>>(
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

  deleteCharacter: async (id: number): Promise<void> => {
    await apiClient.delete(`/service/comic/references/${id}`);
  },

  createScene: async (data: CreateSceneRequest): Promise<SceneResponse> => {
    const response = await apiClient.post<SceneResponse>('/service/comic/scenes/', data);
    return response.data;
  },

  updateScene: async (id: number, data: CreateSceneRequest): Promise<SceneResponse> => {
    const response = await apiClient.put<SceneResponse>(
      `/service/comic/scenes/${id}`, 
      data
    );
    return response.data;
  },

  getScenes: async (projectId: number): Promise<SceneResponse[]> => {
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

  deleteScene: async (id: number): Promise<void> => {
    await apiClient.delete(`/service/comic/scenes/${id}`);
  }
};