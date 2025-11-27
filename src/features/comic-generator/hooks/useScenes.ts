import { useState, useCallback } from 'react';
import { sceneService } from '../services/sceneService';
import { SceneVisualization } from '../types/domain/scene';
import { Reference } from '../types/domain/reference';
import { SceneResponse } from '../types/api/scene';
import { DEFAULT_SCENE_DATA } from '../constants/scene';
import { 
  getAspectRatioValue, 
  getShotTypeValue,
  getShotSizeValue,
  getShotAngleValue,
  getLightingValue,
  getMoodValue,
  getCompositionValue,
  parseCharacterMentions 
} from '../utils/sceneUtils';

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
      setScenes(response.map(mapToDomain));
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
    setScenes(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const removeScene = async (index: number) => {
    const scene = scenes[index];
    if (!scene.id.startsWith('temp_')) {
      try {
        await sceneService.delete(parseInt(scene.id));
      } catch (err: any) {
        setError(err.message || 'Failed to delete scene');
        return;
      }
    }
    setScenes(prev => prev.filter((_, i) => i !== index));
  };

  const generateScene = async (index: number, references: Reference[]) => {
    const scene = scenes[index];
    if (!projectId || !scene.prompt) return;

    setGeneratingIds(prev => new Set(prev).add(scene.id));
    setError(null);

    const standardIds: number[] = [];
    const customIds: number[] = [];

    scene.characters.forEach(refId => {
      const ref = references.find(r => r.id === refId);
      if (!ref) return;
      if (ref.isCustom) customIds.push(parseInt(ref.id));
      else standardIds.push(parseInt(ref.id));
    });

    const payload = {
      project_id: projectId,
      prompt: parseCharacterMentions(scene.prompt, scene.characters, references),
      negative_prompt: scene.negativePrompt || '',
      aspect_ratio: getAspectRatioValue(scene.aspectRatio),
      shot_type: getShotTypeValue(scene.shotType),
      shot_size: getShotSizeValue(scene.shotSize),
      shot_angle: getShotAngleValue(scene.shotAngle),
      lighting: getLightingValue(scene.lighting),
      mood: getMoodValue(scene.mood),
      composition: getCompositionValue(scene.composition),
      character_ids: standardIds.length > 0 ? standardIds : undefined,
      custom_ids: customIds.length > 0 ? customIds : undefined
    };

    try {
      let response: SceneResponse;
      if (scene.id.startsWith('temp_')) {
        response = await sceneService.create(payload);
      } else {
        response = await sceneService.update(parseInt(scene.id), payload);
      }
      
      const updatedScene = mapToDomain(response);
      updatedScene.characters = scene.characters; 
      
      setScenes(prev => prev.map((s, i) => i === index ? updatedScene : s));

    } catch (err: any) {
      setError(err.message || 'Failed to generate scene');
    } finally {
      setGeneratingIds(prev => {
        const next = new Set(prev);
        next.delete(scene.id);
        return next;
      });
    }
  };

  return {
    scenes,
    generatingIds,
    error,
    fetchScenes,
    addScene,
    updateLocalScene,
    removeScene,
    generateScene
  };
};