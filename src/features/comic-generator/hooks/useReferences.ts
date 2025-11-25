import { useState, useCallback } from 'react';
import { referenceService } from '../services/referenceService';
import { Reference, CreateReferenceFormData } from '../types/domain/reference';
import { ReferenceResponse } from '../types/api/reference';

interface UseReferencesReturn {
  references: Reference[];
  loading: boolean;
  error: string | null;
  fetchReferences: (projectId: number) => Promise<void>;
  createReference: (projectId: number, data: CreateReferenceFormData) => Promise<Reference | null>;
  uploadReference: (projectId: number, file: File, type: 'character' | 'background') => Promise<Reference | null>;
}

export const useReferences = (): UseReferencesReturn => {
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapToDomain = (data: ReferenceResponse): Reference => ({
    id: data.id.toString(),
    name: data.name,
    type: data.type,
    imageUrl: data.preview_url,
    prompt: data.prompt,
    clothingPrompt: data.clothing_prompt || undefined,
    negativePrompt: data.negative_prompt,
    llmDescription: data.llm_description,
    isCustom: !!data.ref_image_url
  });

  const fetchReferences = useCallback(async (projectId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await referenceService.getAll(projectId);
      setReferences(response.map(mapToDomain));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch references');
    } finally {
      setLoading(false);
    }
  }, []);

  const createReference = async (projectId: number, data: CreateReferenceFormData): Promise<Reference | null> => {
    setLoading(true);
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
      const newRef = mapToDomain(response);
      setReferences(prev => [newRef, ...prev]);
      return newRef;
    } catch (err: any) {
      setError(err.message || 'Failed to create reference');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const uploadReference = async (projectId: number, file: File, type: 'character' | 'background'): Promise<Reference | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await referenceService.createCustom(projectId, file, type);
      const newRef = mapToDomain(response);
      setReferences(prev => [newRef, ...prev]);
      return newRef;
    } catch (err: any) {
      setError(err.message || 'Failed to upload reference');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    references,
    loading,
    error,
    fetchReferences,
    createReference,
    uploadReference
  };
};