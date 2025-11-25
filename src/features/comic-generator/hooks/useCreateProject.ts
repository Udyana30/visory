import { useState } from 'react';
import { projectService } from '../services/projectService';
import { ProjectFormData, Project } from '../types/domain/project';
import { PAGE_SIZES_MAP, ART_STYLES } from '../constants/project';

interface UseCreateProjectReturn {
  createProject: (formData: ProjectFormData) => Promise<Project | null>;
  loading: boolean;
  error: string | null;
}

export const useCreateProject = (): UseCreateProjectReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = async (formData: ProjectFormData): Promise<Project | null> => {
    setLoading(true);
    setError(null);

    try {
      if (formData.artStyleIndex === null) throw new Error('Art style is required');

      const pageSizeDTO = PAGE_SIZES_MAP[formData.pageSizeLabel];
      const artStyleValue = ART_STYLES[formData.artStyleIndex].apiValue;

      const response = await projectService.create({
        name: formData.name,
        page_size: pageSizeDTO,
        art_style: artStyleValue
      });

      return {
        id: response.id.toString(),
        name: response.name,
        genre: formData.genre,
        artStyle: response.art_style,
        pageSize: response.page_size,
        createdAt: new Date(response.created_at)
      };
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to create project';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createProject, loading, error };
};