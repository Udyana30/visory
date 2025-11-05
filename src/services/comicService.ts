import apiClient from '../lib/apiClient';
import {
  ComicInitData,
  ComicSelectStoryData,
  ComicFinalizeData,
  ComicQueryParams,
  ComicResponse,
  ComicListResponse,
} from '../types/comic2';

const initComic = async (data: ComicInitData): Promise<ComicResponse> => {
  try {
    const response = await apiClient.post<ComicResponse>('/service/comic/init', data);
    return response.data;
  } catch (error) {
    console.error('Error in initComic service:', error);
    throw error;
  }
};

const selectComicStory = async (comicId: string, data: ComicSelectStoryData): Promise<ComicResponse> => {
  try {
    const response = await apiClient.put<ComicResponse>(`/service/comic/${comicId}/select-story`, data);
    return response.data;
  } catch (error) {
    console.error('Error in selectComicStory service:', error);
    throw error;
  }
};

const finalizeComic = async (comicId: string, data: ComicFinalizeData): Promise<ComicResponse> => {
  try {
    const response = await apiClient.put<ComicResponse>(`/service/comic/${comicId}/finalize`, data);
    return response.data;
  } catch (error) {
    console.error('Error in finalizeComic service:', error);
    throw error;
  }
};

const getComicById = async (comicId: string): Promise<ComicResponse> => {
  try {
    const response = await apiClient.get<ComicResponse>(`/service/comic/${comicId}`);
    return response.data;
  } catch (error) {
    console.error('Error in getComicById service:', error);
    throw error;
  }
};

const getComics = async (params: ComicQueryParams = {}): Promise<ComicListResponse> => {
  try {
    const queryParams = new URLSearchParams({
      order_by: params.order_by || 'id',
      order_dir: params.order_dir || 'desc',
      page: String(params.page || 1),
      limit: String(params.limit || 10),
    });

    const response = await apiClient.get<ComicListResponse>(`/service/comics?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error in getComics service:', error);
    throw error;
  }
};

const uploadReferences = async (formData: FormData): Promise<ComicResponse> => {
  try {
    const response = await apiClient.post<ComicResponse>('/service/comic/upload-references', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error in uploadReferences service:', error);
    throw error;
  }
};

export const comicService = {
  initComic,
  selectComicStory,
  finalizeComic,
  getComicById,
  getComics,
  uploadReferences,
};
