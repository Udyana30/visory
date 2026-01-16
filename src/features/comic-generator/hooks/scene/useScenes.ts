import { useState, useCallback } from 'react';
import { sceneService } from '../../services/sceneService';
import { SceneVisualization } from '../../types/domain/scene';
import { Reference } from '../../types/domain/reference';
import { SceneResponse } from '../../types/api/scene';
import { DEFAULT_SCENE_DATA } from '../../constants/scene';
import {
  getAspectRatioValue,
  getShotTypeValue,
  getShotSizeValue,
  getShotAngleValue,
  getLightingValue,
  getMoodValue,
  getCompositionValue
} from '../../utils/sceneUtils';

export const useScenes = (projectId: number | null) => {
  const [scenes, setScenes] = useState<SceneVisualization[]>([]);
  const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const mapToDomain = (data: SceneResponse): SceneVisualization => ({
    id: data.id.toString(),
    prompt: data.prompt,
    aspectRatio: data.aspect_ratio,
    shotType: data.shot_type,
    shotSize: data.shot_size,
    shotAngle: data.shot_angle,
    lighting: data.lighting,
    mood: data.mood,
    composition: data.composition,
    characters: data.character_ids ? data.character_ids.map(String) : [],
    imageUrl: data.image_url,
    negativePrompt: data.negative_prompt
  });

  const fetchScenes = useCallback(async () => {
    if (!projectId) return;
    try {
      const response = await sceneService.getAll(projectId);

      // Filter out custom scenes (prompt === 'Custom Scene')
      // Custom scenes are only for Image Library in Comic Editor, not for Scene Visualization
      const mappedScenes = response
        .filter(scene => scene.prompt !== 'Custom Scene')
        .map(mapToDomain);

      if (mappedScenes.length === 0) {
        const defaultScene: SceneVisualization = {
          id: `temp_${Date.now()}`,
          ...DEFAULT_SCENE_DATA
        };
        setScenes([defaultScene]);
      } else {
        setScenes(mappedScenes);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch scenes');
    }
  }, [projectId]);

  const addScene = () => {
    const newScene: SceneVisualization = {
      id: `temp_${Date.now()}`,
      ...DEFAULT_SCENE_DATA
    };
    setScenes(prev => [...prev, newScene]);
  };

  const updateLocalScene = (index: number, field: keyof SceneVisualization, value: any) => {
    setScenes(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const deleteScene = useCallback(async (sceneId: string) => {
    if (!projectId || sceneId.startsWith('temp_')) {
      setScenes(prev => prev.filter(s => s.id !== sceneId));
      return;
    }

    try {
      await sceneService.delete(Number(sceneId));
      setScenes(prev => prev.filter(s => s.id !== sceneId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete scene');
    }
  }, [projectId]);

  const generateScene = useCallback(async (index: number, references: Reference[]) => {
    if (!projectId) return;

    const scene = scenes[index];
    if (!scene) return;

    const isNewScene = scene.id.startsWith('temp_');
    setGeneratingIds(prev => new Set(prev).add(scene.id));

    try {
      const characterIds = references.map(ref => Number(ref.id));

      const sceneData = {
        project_id: projectId,
        prompt: scene.prompt,
        aspect_ratio: getAspectRatioValue(scene.aspectRatio),
        shot_type: getShotTypeValue(scene.shotType),
        shot_size: getShotSizeValue(scene.shotSize),
        shot_angle: getShotAngleValue(scene.shotAngle),
        lighting: getLightingValue(scene.lighting),
        mood: getMoodValue(scene.mood),
        composition: getCompositionValue(scene.composition),
        character_ids: characterIds.length > 0 ? characterIds : null,
        custom_ids: null,
        background_id: null,
        negative_prompt: scene.negativePrompt || ''
      };

      console.log('🚀 Scene Generation Payload:', JSON.stringify(sceneData, null, 2));

      const response = isNewScene
        ? await sceneService.create(sceneData)
        : await sceneService.update(Number(scene.id), sceneData);

      console.log('✅ Scene Generation Response:', response);

      const updatedScene = mapToDomain(response);

      setScenes(prev => {
        const updated = [...prev];
        updated[index] = updatedScene;
        return updated;
      });
    } catch (err: any) {
      console.error('❌ Scene Generation Error:', err);
      console.error('Error response:', err.response?.data);
      setError(err.message || 'Failed to generate scene');
    } finally {
      setGeneratingIds(prev => {
        const next = new Set(prev);
        next.delete(scene.id);
        return next;
      });
    }
  }, [projectId, scenes]);

  return {
    scenes,
    generatingIds,
    error,
    fetchScenes,
    addScene,
    updateLocalScene,
    removeScene: deleteScene,
    generateScene
  };
};