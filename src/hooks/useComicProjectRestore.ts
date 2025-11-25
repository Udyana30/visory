'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { comicService } from '@/services/comic/comicService';
import { ProjectResponse, CharacterResponse, SceneResponse } from '@/types/comic';

export interface RestoredProject {
  id: number;
  name: string;
  page_size: { width: number; height: number };
  art_style: string;
  created_at: string;
  updated_at: string;
}

export interface RestoredCharacter {
  id: string;
  name: string;
  type: string;
  prompt: string;
  clothing_prompt: string;
  negative_prompt: string;
  preview_url: string;
  ref_image_url?: string | null;
}

export interface RestoredScene {
  id: string;
  character_ids: string[];
  aspect_ratio: string;
  shot_type: string;
  shot_size: string;
  shot_angle: string;
  lighting: string;
  mood: string;
  composition: string;
  prompt: string;
  negative_prompt: string;
  image_url: string;
}

export interface RestoredComicData {
  project: RestoredProject | null;
  characters: RestoredCharacter[];
  scenes: RestoredScene[];
}

export const useComicProjectRestore = () => {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');

  const [restoredData, setRestoredData] = useState<RestoredComicData>({
    project: null,
    characters: [],
    scenes: [],
  });
  const [isRestoring, setIsRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setRestoredData({ project: null, characters: [], scenes: [] });
      return;
    }

    const restoreProject = async () => {
      setIsRestoring(true);
      setError(null);

      try {
        const projectIdNum = parseInt(projectId, 10);

        if (isNaN(projectIdNum)) {
          throw new Error('Invalid project ID');
        }

        const [projectData, charactersData, scenesData] = await Promise.all([
          comicService.getProjectById(projectIdNum),
          comicService.getCharacters(projectIdNum),
          comicService.getScenes(projectIdNum),
        ]);

        const transformedProject: RestoredProject = {
          id: projectData.id,
          name: projectData.name,
          page_size: projectData.page_size,
          art_style: projectData.art_style,
          created_at: projectData.created_at,
          updated_at: projectData.updated_at,
        };

        const transformedCharacters: RestoredCharacter[] = charactersData.map((char: CharacterResponse) => ({
          id: char.id.toString(),
          name: char.name,
          type: char.type,
          prompt: char.prompt,
          clothing_prompt: char.clothing_prompt,
          negative_prompt: char.negative_prompt,
          preview_url: char.preview_url,
          ref_image_url: char.ref_image_url,
        }));

        const transformedScenes: RestoredScene[] = scenesData.map((scene: SceneResponse) => ({
          id: scene.id.toString(),
          character_ids: Array.isArray(scene.character_ids) 
            ? scene.character_ids.map((id: number) => id.toString()) 
            : [],
          aspect_ratio: scene.aspect_ratio || '16:9',
          shot_type: scene.shot_type || 'auto',
          shot_size: scene.shot_size || 'auto',
          shot_angle: scene.shot_angle || 'auto',
          lighting: scene.lighting || 'auto',
          mood: scene.mood || 'auto',
          composition: scene.composition || 'auto',
          prompt: scene.prompt || '',
          negative_prompt: scene.negative_prompt || 'blurry, low quality, distorted',
          image_url: scene.image_url || '',
        }));

        setRestoredData({
          project: transformedProject,
          characters: transformedCharacters,
          scenes: transformedScenes,
        });
      } catch (err: any) {
        console.error('Failed to restore project:', err);
        setError(err?.message || 'Failed to restore project.');
        setRestoredData({ project: null, characters: [], scenes: [] });
      } finally {
        setIsRestoring(false);
      }
    };

    restoreProject();
  }, [projectId]);

  return {
    restoredData,
    isRestoring,
    error,
    hasProjectId: !!projectId,
  };
};