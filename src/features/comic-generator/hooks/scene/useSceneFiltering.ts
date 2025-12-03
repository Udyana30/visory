import { useState, useMemo } from 'react';
import { SceneVisualization } from '../../types/domain/scene';

export type FilterMode = 'all' | 'generated' | 'draft';

export const useSceneFiltering = (scenes: SceneVisualization[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');

  const filteredScenes = useMemo(() => {
    return scenes.filter(scene => {
      const matchesSearch = scene.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            `Scene ${scenes.indexOf(scene) + 1}`.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterMode === 'all' 
        ? true 
        : filterMode === 'generated' 
          ? !!scene.imageUrl 
          : !scene.imageUrl;

      return matchesSearch && matchesFilter;
    });
  }, [scenes, searchQuery, filterMode]);

  return {
    searchQuery,
    setSearchQuery,
    filterMode,
    setFilterMode,
    filteredScenes
  };
};