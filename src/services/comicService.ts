import apiClient from '@/lib/apiClient';
import { 
  CreateProjectRequest, 
  ProjectResponse,
  CreateCharacterRequest,
  CharacterResponse,
  CreateSceneRequest,
  SceneResponse
} from '@/types/comicApi';

export const comicService = {
  createProject: async (data: CreateProjectRequest): Promise<ProjectResponse> => {
    const response = await apiClient.post<ProjectResponse>(
      '/service/comic/projects/',
      data
    );
    return response.data;
  },

  createCharacter: async (data: CreateCharacterRequest): Promise<CharacterResponse> => {
    const response = await apiClient.post<CharacterResponse>(
      '/service/comic/references/',
      data
    );
    return response.data;
  },

  createScene: async (data: CreateSceneRequest): Promise<SceneResponse> => {
    const response = await apiClient.post<SceneResponse>(
      '/service/comic/scenes/',
      data
    );
    return response.data;
  },
};