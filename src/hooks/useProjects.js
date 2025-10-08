'use client';

import { useState, useEffect } from 'react';
import { sttService } from '@/services/sttService';
import { ttsService } from '@/services/ttsService';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchAllProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [sttResponse, ttsResponse] = await Promise.all([
          sttService.getSTT({ page, limit: 10 }),
          ttsService.getTTS({ page, limit: 10 })
        ]);

        const sttProjects = sttResponse.data.map(p => ({ ...p, project_type: 'stt' }));
        const ttsProjects = ttsResponse.data.map(p => ({ ...p, project_type: 'tts' }));

        const allProjects = [...sttProjects, ...ttsProjects]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setProjects(allProjects);
      } catch (err) {
        setError(err.message || 'Failed to fetch projects.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllProjects();
  }, [page]);

  return { projects, isLoading, error, setPage };
};