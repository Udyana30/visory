import { useState, useEffect, useCallback } from 'react';
import { SceneVisualization } from '../../types/domain/scene';

export const useSceneNavigation = (scenes: SceneVisualization[]) => {
  const [activeSceneId, setActiveSceneId] = useState<string | null>(null);

  useEffect(() => {
    if (scenes.length > 0) {
      // Auto-select first scene if none selected or current selection is invalid
      const isValidSelection = activeSceneId && scenes.some(s => s.id === activeSceneId);
      if (!isValidSelection) {
        setActiveSceneId(scenes[0].id);
      }
    } else {
      setActiveSceneId(null);
    }
  }, [scenes, activeSceneId]);

  const activeIndex = scenes.findIndex(s => s.id === activeSceneId);

  const navigateTo = (id: string) => setActiveSceneId(id);

  const nextScene = useCallback(() => {
    if (activeIndex < scenes.length - 1) {
      setActiveSceneId(scenes[activeIndex + 1].id);
    }
  }, [activeIndex, scenes]);

  const prevScene = useCallback(() => {
    if (activeIndex > 0) {
      setActiveSceneId(scenes[activeIndex - 1].id);
    }
  }, [activeIndex, scenes]);

  return {
    activeSceneId,
    activeIndex,
    navigateTo,
    nextScene,
    prevScene,
    isFirst: activeIndex <= 0,
    isLast: activeIndex >= scenes.length - 1
  };
};