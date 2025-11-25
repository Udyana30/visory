'use client';

import { useState, useEffect, useCallback } from 'react';
import { sttService } from '@/services/sttService';
import { ttsService } from '@/services/ttsService';
import { comicService, ComicListResponse } from '@/services/comic/comicService';
import { STTListResponse } from '@/types/stt';
import { TTSListResponse } from '@/types/tts';
import { UnifiedProject, STTProject, TTSProject, ComicProject } from '@/types/project';

export const useProjects = () => {
  const [projects, setProjects] = useState<UnifiedProject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const fetchAllProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [sttResponse, ttsResponse, comicResponse]: [
        STTListResponse,
        TTSListResponse,
        ComicListResponse
      ] = await Promise.all([
        sttService.getSTT({ page, limit }),
        ttsService.getTTS({ page, limit }),
        comicService.getProjects({ page, limit })
      ]);

      const sttProjects: STTProject[] = sttResponse.data.map((p) => ({
        id: p.id,
        title: p.title,
        created_at: p.created_at,
        project_type: 'stt',
        input_audio_url: p.input_audio_url,
        output_raw_text: p.output_raw_text,
        language: p.language,
      }));

      const ttsProjects: TTSProject[] = ttsResponse.data.map((p) => ({
        id: p.id,
        title: p.title,
        created_at: p.created_at,
        project_type: 'tts',
        input_text: p.input_text,
        output_speech_url: p.output_speech_url,
        voice_name: p.voice_name,
        rate: p.rate,
        volume: p.volume,
        pitch: p.pitch,
      }));

      const comicProjects: ComicProject[] = (comicResponse.data || []).map((p) => ({
        id: p.id,
        name: p.name,
        created_at: p.created_at,
        updated_at: p.updated_at,
        project_type: 'comic',
        page_size: p.page_size,
        art_style: p.art_style,
      }));

      const allProjects: UnifiedProject[] = [...sttProjects, ...ttsProjects, ...comicProjects].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setProjects(allProjects);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch projects.');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchAllProjects();
  }, [fetchAllProjects]);

  const deleteProject = useCallback(async (id: number, projectType: string) => {
    try {
      if (projectType === 'stt') {
        await sttService.deleteSTT(id);
      } else if (projectType === 'tts') {
        await ttsService.deleteTTS(id);
      } else if (projectType === 'comic') {
        await comicService.deleteProject(id);
      }

      setProjects(prev => 
        prev.filter(p => !(p.id === id && p.project_type === projectType))
      );

      return { success: true };
    } catch (err: any) {
      console.error('Error deleting project:', err);
      throw new Error(err?.message || 'Failed to delete project');
    }
  }, []);

  const refetch = useCallback(() => {
    fetchAllProjects();
  }, [fetchAllProjects]);

  return { 
    projects, 
    isLoading, 
    error, 
    setPage, 
    deleteProject,
    refetch 
  };
};