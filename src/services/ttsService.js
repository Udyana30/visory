import apiClient from '@/lib/apiClient';

const createTTS = async (data) => {
  try {
    const response = await apiClient.post('/service/tts/create', data);
    return response.data;
  } catch (error) {
    console.error("Error in createTTS service:", error);
    throw error;
  }
};

const getTTS = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      order_by: params.order_by || 'id',
      order_dir: params.order_dir || 'asc',
      page: params.page || 1,
      limit: params.limit || 10,
    });

    const response = await apiClient.get(`/service/tts?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error("Error in getTTS service:", error);
    throw error;
  }
};

export const ttsService = {
  createTTS,
  getTTS,
};

