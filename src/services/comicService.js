import apiClient from "@/lib/apiClient";

const initComic = async (data) => {
  try {
    const response = await apiClient.post("/service/comic/init", data);
    return response.data;
  } catch (error) {
    console.error("Error in initComic service:", error);
    throw error;
  }
};

const selectComicStory = async (comicId, data) => {
  try {
    const response = await apiClient.put(`/service/comic/${comicId}/select-story`, data);
    return response.data;
  } catch (error) {
    console.error("Error in selectComicStory service:", error);
    throw error;
  }
};

const finalizeComic = async (comicId, data) => {
  try {
    const response = await apiClient.put(`/service/comic/${comicId}/finalize`, data);
    return response.data;
  } catch (error) {
    console.error("Error in finalizeComic service:", error);
    throw error;
  }
};

const getComicById = async (comicId) => {
  try {
    const response = await apiClient.get(`/service/comic/${comicId}`);
    return response.data;
  } catch (error) {
    console.error("Error in getComicById service:", error);
    throw error;
  }
};

const getComics = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      order_by: params.order_by || "id",
      order_dir: params.order_dir || "desc",
      page: params.page || 1,
      limit: params.limit || 10,
    });
    const response = await apiClient.get(`/service/comics?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error("Error in getComics service:", error);
    throw error;
  }
};

const uploadReferences = async (formData) => {
  try {
    const response = await apiClient.post("/service/comic/upload-references", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error in uploadReferences service:", error);
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
