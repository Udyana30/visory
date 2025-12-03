import { Project } from '../types/domain/project';
import { Reference } from '../types/domain/reference';
import { SceneVisualization } from '../types/domain/scene';
import { RestoredData } from '../hooks/useProjectRestore';
import { mapToDomain as mapReferenceToDomain } from './referenceMapper';

export const mapRestoredData = (
  projectData: any, 
  referencesData: any[], 
  scenesData: any[]
): RestoredData => {
  const mappedProject: Project = {
    id: String(projectData.id),
    name: projectData.name,
    artStyle: projectData.art_style,
    pageSize: projectData.page_size,
    createdAt: new Date(projectData.created_at),
    genre: projectData.genre || '',
    language: projectData.language || '',
    description: projectData.description || ''
  };

  const mappedReferences: Reference[] = referencesData.map(mapReferenceToDomain);

  const mappedScenes: SceneVisualization[] = scenesData.map((scene: any) => ({
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

  return {
    project: mappedProject,
    references: mappedReferences,
    scenes: mappedScenes,
    externalReferences: [] 
  };
};