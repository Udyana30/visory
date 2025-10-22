import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "comic_generator_state";

export default function useComicState() {
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") return getInitialState();
    
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error("Failed to parse saved state:", error);
        return getInitialState();
      }
    }
    return getInitialState();
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const updateState = useCallback((updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetState = useCallback(() => {
    setState(getInitialState());
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    state,
    updateState,
    resetState,
  };
}

function getInitialState() {
  return {
    currentStep: 1,
    formData: {
      prompt: "",
      num_scenes: 2,
      num_characters: 2,
      with_dialog: true,
      language: "english",
    },
    comicData: null,
    selectedStory: null,
    selectedStoryIndex: null,
    imageReferences: [],
    config: {
      grid_cols: 1,
      orientation: "horizontal",
      ratio: "1:1",
      style: "manga",
      model_type: "google_imagen",
    },
    generatedImages: [],
    updatedStory: null,
  };
}