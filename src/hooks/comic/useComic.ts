import { useState } from 'react';
import { comicService } from '@/services/comic/comicService';
import { 
  CreateProjectRequest, 
  ProjectResponse, 
  CreateCharacterRequest,
  CharacterResponse,
  CreateSceneRequest,
  SceneResponse,
  ApiError 
} from '@/types/comic';

export const useComicProject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const createProject = async (data: CreateProjectRequest): Promise<ProjectResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await comicService.createProject(data);
      return response;
    } catch (err: any) {
      const apiError: ApiError = {
        message: err.response?.data?.message 
          || err.response?.data?.detail 
          || err.message 
          || 'Failed to create project',
        status: err.response?.status
      };
      
      setError(apiError);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createCharacter = async (data: CreateCharacterRequest): Promise<CharacterResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await comicService.createCharacter(data);
      return response;
    } catch (err: any) {
      let errorMessage = 'Failed to create character';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check your connection or backend server.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      const apiError: ApiError = {
        message: errorMessage,
        status: err.response?.status
      };
      
      setError(apiError);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createCustomCharacter = async (projectId: number, file: File): Promise<CharacterResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await comicService.createCustomCharacter(projectId, file);
      return response;
    } catch (err: any) {
      const apiError: ApiError = {
        message: err.response?.data?.message 
          || err.response?.data?.detail 
          || err.message 
          || 'Failed to upload character reference',
        status: err.response?.status
      };
      
      setError(apiError);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createScene = async (data: CreateSceneRequest): Promise<SceneResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await comicService.createScene(data);
      return response;
    } catch (err: any) {
      const apiError: ApiError = {
        message: err.response?.data?.message 
          || err.response?.data?.detail 
          || err.message 
          || 'Failed to create scene',
        status: err.response?.status
      };
      
      setError(apiError);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateScene = async (
    id: number, 
    data: CreateSceneRequest
  ): Promise<SceneResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await comicService.updateScene(id, data);
      return response;
    } catch (err: any) {
      const apiError: ApiError = {
        message: err.response?.data?.message 
          || err.response?.data?.detail 
          || err.message 
          || 'Failed to update scene',
        status: err.response?.status
      };
      
      setError(apiError);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createProject,
    createCharacter,
    createCustomCharacter,
    createScene,
    updateScene,
    loading,
    error,
  };
};