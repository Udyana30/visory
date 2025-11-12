import { useState } from 'react';
import { comicService } from '@/services/comicService';
import { 
  CreateProjectRequest, 
  ProjectResponse, 
  CreateCharacterRequest,
  CharacterResponse,
  CreateSceneRequest,
  SceneResponse,
  ApiError 
} from '@/types/comicApi';

export const useComicProject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const createProject = async (data: CreateProjectRequest): Promise<ProjectResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await comicService.createProject(data);
      console.log('✅ Project created successfully:', response);
      return response;
    } catch (err: any) {
      console.error('❌ Create project error:', err);
      
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
      console.log('🎨 Creating character with data:', data);
      const response = await comicService.createCharacter(data);
      console.log('✅ Character created successfully:', response);
      return response;
    } catch (err: any) {
      console.error('❌ Create character error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        code: err.code,
      });
      
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

  const createScene = async (data: CreateSceneRequest): Promise<SceneResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🎬 Creating scene with data:', data);
      const response = await comicService.createScene(data);
      console.log('✅ Scene created successfully:', response);
      return response;
    } catch (err: any) {
      console.error('❌ Create scene error:', err);
      
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

  return {
    createProject,
    createCharacter,
    createScene,
    loading,
    error,
  };
};