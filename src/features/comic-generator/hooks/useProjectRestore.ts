import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { projectService } from '../services/projectService';
import { referenceService } from '../services/referenceService';
import { sceneService } from '../services/sceneService';
import { mapRestoredData } from '../utils/projectMapper';
import { mapToDomain } from '../utils/referenceMapper';
import { Project } from '../types/domain/project';
import { Reference } from '../types/domain/reference';
import { SceneVisualization } from '../types/domain/scene';

export interface RestoredData {
  project: Project | null;
  references: Reference[];
  externalReferences: Reference[];
  scenes: SceneVisualization[];
}

export const useComicProjectRestore = (initialData?: RestoredData | null) => {
  const searchParams = useSearchParams();
  const projectIdParam = searchParams.get('projectId');

  const [restoredData, setRestoredData] = useState<RestoredData>(() => {
    if (initialData && initialData.project?.id === projectIdParam) {
      return initialData;
    }
    return { project: null, references: [], externalReferences: [], scenes: [] };
  });
  
  const [isRestoring, setIsRestoring] = useState(() => {
    return !!(initialData && initialData.project?.id === projectIdParam) ? false : !!projectIdParam;
  });
  
  const [error, setError] = useState<string | null>(null);
  const initialLoadDone = useRef(!!initialData);

  useEffect(() => {
    if (!projectIdParam) {
      setRestoredData({ project: null, references: [], externalReferences: [], scenes: [] });
      setIsRestoring(false);
      return;
    }

    if (initialLoadDone.current && restoredData.project?.id === projectIdParam) {
      initialLoadDone.current = false;
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
          referenceService.getAllByProject(projectId),
          sceneService.getAll(projectId),
        ]);

        const projectRefIds = new Set(referencesData.map(r => r.id));
        const sceneCharacterIds = new Set<number>();
        
        scenesData.forEach((scene: any) => {
          if (scene.character_ids) {
            scene.character_ids.forEach((id: number) => sceneCharacterIds.add(id));
          }
          if (scene.custom_ids) {
            scene.custom_ids.forEach((id: number) => sceneCharacterIds.add(id));
          }
        });

        const missingIds = Array.from(sceneCharacterIds).filter(id => !projectRefIds.has(id));
        
        const storageKey = `comic_project_${projectId}_external_refs`;
        const storedIds = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const allExternalIds = Array.from(new Set([...missingIds, ...storedIds]));

        const externalRefsData = await Promise.all(
          allExternalIds.map(id => referenceService.getById(Number(id)).catch(() => null))
        );

        const validExternalRefs = externalRefsData
          .filter(Boolean)
          .map(data => mapToDomain(data!));

        const filteredProjectRefs = referencesData.filter(
          ref => ref.project_id === projectId
        );

        const mappedData = mapRestoredData(projectData, filteredProjectRefs, scenesData);
        
        setRestoredData({
          ...mappedData,
          externalReferences: validExternalRefs
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