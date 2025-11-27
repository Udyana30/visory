import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { projectService } from '../services/projectService';
import { referenceService } from '../services/referenceService';
import { sceneService } from '../services/sceneService';

import { Project } from '../types/domain/project';
import { Reference } from '../types/domain/reference';
import { SceneVisualization } from '../types/domain/scene';
import { ReferenceResponse } from '../types/api/reference';
import { SceneResponse } from '../types/api/scene';

export interface RestoredData {
  project: Project | null;
  references: Reference[];
  scenes: SceneVisualization[];
}

export const useComicProjectRestore = () => {
  const searchParams = useSearchParams();
  const projectIdParam = searchParams.get('projectId');

  const [restoredData, setRestoredData] = useState<RestoredData>({
    project: null,
    references: [],
    scenes: [],
  });
  
  const [isRestoring, setIsRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectIdParam) {
      setRestoredData({ project: null, references: [], scenes: [] });
      return;
    }

    const restoreProject = async () => {
      setIsRestoring(true);
      setError(null);

      try {
        const projectId = parseInt(projectIdParam, 10);
        if (isNaN(projectId)) throw new Error('Invalid project ID');

        const [projectData, referencesData, scenesData] = await Promise.all([
          projectService.getById(projectId),
          referenceService.getAll(projectId),
          sceneService.getAll(projectId),
        ]);

        const mappedProject: Project = {
          id: String(projectData.id),
          name: projectData.name,
          artStyle: projectData.art_style,
          pageSize: projectData.page_size,
          createdAt: new Date(projectData.created_at),
          genre: ''
        };

        const mappedReferences: Reference[] = referencesData.map((ref: ReferenceResponse) => ({
          id: String(ref.id),
          name: ref.name,
          type: ref.type,
          imageUrl: ref.preview_url || ref.ref_image_url || '',
          prompt: ref.prompt,
          clothingPrompt: ref.clothing_prompt || undefined,
          negativePrompt: ref.negative_prompt,
          llmDescription: ref.llm_description,
          isCustom: !!ref.ref_image_url
        }));

        const mappedScenes: SceneVisualization[] = scenesData.map((scene: SceneResponse) => ({
          id: String(scene.id),
          prompt: scene.prompt,
          aspectRatio: scene.aspect_ratio,
          shotType: scene.shot_type,
          shotSize: scene.shot_size,
          shotAngle: scene.shot_angle,
          lighting: scene.lighting,
          mood: scene.mood,
          composition: scene.composition,
          characters: scene.character_ids ? scene.character_ids.map(String) : [],
          imageUrl: scene.image_url,
          negativePrompt: scene.negative_prompt,
        }));

        setRestoredData({
          project: mappedProject,
          references: mappedReferences,
          scenes: mappedScenes,
        });

      } catch (err: any) {
        console.error(err);
        setError(err?.message || 'Failed to load project data.');
      } finally {
        setIsRestoring(false);
      }
    };

    restoreProject();
  }, [projectIdParam]);

  return {
    restoredData,
    isRestoring,
    error,
    hasProjectId: !!projectIdParam,
  };
};