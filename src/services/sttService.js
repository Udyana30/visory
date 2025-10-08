import apiClient from '@/lib/apiClient';

const getSTT = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      order_by: params.order_by || 'id',
      order_dir: params.order_dir || 'asc',
      page: params.page || 1,
      limit: params.limit || 10,
    });

    const response = await apiClient.get(`/service/stt?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error("Error in getSTT service:", error);
    throw error;
  }
};

const createSTT = async (formData) => {
  try {
    const response = await apiClient.post('/service/stt/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in createSTT service:", error);
    throw error;
  }
};

export const sttService = {
  getSTT,
  createSTT,
};