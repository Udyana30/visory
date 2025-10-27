import apiClient from '../lib/apiClient';
import { TTSRequestData, TTSResponse, TTSQueryParams } from '../types/tts';

const createTTS = async (data: TTSRequestData): Promise<TTSResponse> => {
  try {
    const response = await apiClient.post<TTSResponse>('/service/tts/create', data);
    return response.data;
  } catch (error) {
    console.error('Error in createTTS service:', error);
    throw error;
  }
};

const getTTS = async (params: TTSQueryParams = {}): Promise<TTSResponse[]> => {
  try {
    const queryParams = new URLSearchParams({
      order_by: params.order_by || 'id',
      order_dir: params.order_dir || 'asc',
      page: String(params.page || 1),
      limit: String(params.limit || 10),
    });

    const response = await apiClient.get<TTSResponse[]>(`/service/tts?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error in getTTS service:', error);
    throw error;
  }
};

export const ttsService = {
  createTTS,
  getTTS,
};
