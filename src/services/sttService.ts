import apiClient from '../lib/apiClient';
import { STTQueryParams, STTResponse, STTCreateResponse } from '../types/stt';

const getSTT = async (params: STTQueryParams = {}): Promise<STTResponse[]> => {
  try {
    const queryParams = new URLSearchParams({
      order_by: params.order_by || 'id',
      order_dir: params.order_dir || 'asc',
      page: String(params.page || 1),
      limit: String(params.limit || 10),
    });

    const response = await apiClient.get<STTResponse[]>(`/service/stt?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error in getSTT service:', error);
    throw error;
  }
};

const createSTT = async (formData: FormData): Promise<STTCreateResponse> => {
  try {
    const response = await apiClient.post<STTCreateResponse>('/service/stt/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in createSTT service:', error);
    throw error;
  }
};

export const sttService = {
  getSTT,
  createSTT,
};
