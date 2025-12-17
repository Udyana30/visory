import { useState } from 'react';
import { projectService } from '../../services/projectService';
import { ProjectFormData, Project } from '../../types/domain/project';
import { PAGE_SIZES_MAP, ART_STYLES } from '../../../../constants/comic';

interface UseUpdateProjectReturn {
  updateProject: (id: number, formData: ProjectFormData) => Promise<Project | null>;
  loading: boolean;
  error: string | null;
}

export const useUpdateProject = (): UseUpdateProjectReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProject = async (id: number, formData: ProjectFormData): Promise<Project | null> => {
    setLoading(true);
    setError(null);

    try {
      if (formData.artStyleIndex === null) throw new Error('Art style is required');

      const pageSizeDTO = PAGE_SIZES_MAP[formData.pageSizeLabel];
      const artStyleValue = ART_STYLES[formData.artStyleIndex].apiValue;

      const response = await projectService.update(id, {
        name: formData.name,
        page_size: pageSizeDTO,
        art_style: artStyleValue,
        description: formData.description,
        genre: formData.genre,
        language: formData.language
      });

      return {
        id: response.id.toString(),
        name: response.name,
        genre: response.genre,
        language: response.language,
        description: response.description,
        artStyle: response.art_style,
        pageSize: response.page_size,
        createdAt: new Date(response.created_at)
      };
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to update project';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateProject, loading, error };
};