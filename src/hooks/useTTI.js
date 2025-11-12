import { useState, useCallback } from "react";
import { comicService } from "@/services/comicService";

export default function useComic() {
  const [loading, setLoading] = useState(false);
  const [comics, setComics] = useState([]);
  const [currentComic, setCurrentComic] = useState(null);

  const createComicInit = useCallback(async (payload) => {
    setLoading(true);
    try {
      const data = await comicService.initComic(payload);
      setCurrentComic(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const selectStory = useCallback(async (comicId, payload) => {
    setLoading(true);
    try {
      const data = await comicService.selectComicStory(comicId, payload);
      setCurrentComic(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const finalize = useCallback(async (comicId, payload) => {
    setLoading(true);
    try {
      const data = await comicService.finalizeComic(comicId, payload);
      setCurrentComic(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchComicById = useCallback(async (comicId) => {
    setLoading(true);
    try {
      const data = await comicService.getComicById(comicId);
      setCurrentComic(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchComics = useCallback(async (params) => {
    setLoading(true);
    try {
      const data = await comicService.getComics(params);
      setComics(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadRefs = useCallback(async (formData) => {
    setLoading(true);
    try {
      const data = await comicService.uploadReferences(formData);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    comics,
    currentComic,
    createComicInit,
    selectStory,
    finalize,
    fetchComicById,
    fetchComics,
    uploadRefs,
  };
}
