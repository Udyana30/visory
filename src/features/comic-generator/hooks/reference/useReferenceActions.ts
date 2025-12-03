import { useState } from 'react';
import { referenceService } from '../../services/referenceService';
import { CreateReferenceFormData, Reference } from '../../types/domain/reference';
import { mapToDomain } from '../../utils/referenceMapper';
import { ReferenceType } from '../../types/api/reference';

export const useReferenceActions = () => {
  const [isActing, setIsActing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAIReference = async (projectId: number, data: CreateReferenceFormData): Promise<Reference | null> => {
    setIsActing(true);
    setError(null);
    try {
      const response = await referenceService.create({
        project_id: projectId,
        name: data.name,
        type: data.type,
        prompt: data.prompt,
        clothing_prompt: data.clothingPrompt,
        negative_prompt: data.negativePrompt,
      });
      return mapToDomain(response);
    } catch (err: any) {
      setError(err.message || 'Failed to generate reference');
      return null;
    } finally {
      setIsActing(false);
    }
  };

  const uploadCustomReference = async (projectId: number, file: File, type: ReferenceType): Promise<Reference | null> => {
    setIsActing(true);
    setError(null);
    try {
      const response = await referenceService.createCustom(projectId, file, type);
      return mapToDomain(response);
    } catch (err: any) {
      setError(err.message || 'Failed to upload reference');
      return null;
    } finally {
      setIsActing(false);
    }
  };

  const updateReference = async (
    originalRef: Reference,
    data: CreateReferenceFormData, 
    currentProjectId: number
  ): Promise<Reference | null> => {
    setIsActing(true);
    setError(null);
    
    try {
      if (Number(originalRef.projectId) === currentProjectId) {
        const response = await referenceService.update(Number(originalRef.id), {
          project_id: currentProjectId,
          name: data.name,
          type: data.type,
          prompt: data.prompt,
          clothing_prompt: data.clothingPrompt,
          negative_prompt: data.negativePrompt,
        });
        return mapToDomain(response);
      } else {
        const response = await referenceService.create({
          project_id: currentProjectId,
          name: data.name,
          type: data.type,
          prompt: data.prompt,
          clothing_prompt: data.clothingPrompt,
          negative_prompt: data.negativePrompt,
          ref_image_url: originalRef.imageUrl 
        });
        return mapToDomain(response);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update reference');
      return null;
    } finally {
      setIsActing(false);
    }
  };

  const deleteReference = async (
    ref: Reference, 
    currentProjectId: number
  ): Promise<'deleted' | 'detached' | 'failed'> => {
    setIsActing(true);
    setError(null);
    try {
      if (Number(ref.projectId) === currentProjectId) {
        await referenceService.delete(Number(ref.id));
        return 'deleted';
      } else {
        return 'detached';
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete reference');
      return 'failed';
    } finally {
      setIsActing(false);
    }
  };

  const importFromLibrary = async (referenceId: string, projectId: number): Promise<boolean> => {
    return true; 
  };

  return { 
    isActing, 
    error, 
    createAIReference, 
    uploadCustomReference, 
    updateReference,
    deleteReference,
    importFromLibrary 
  };
};