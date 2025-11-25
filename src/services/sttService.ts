import apiClient from '@/lib/apiClient';
import { STTQueryParams, STTCreateResponse, STTListResponse } from '@/types/stt';

const getSTT = async (params: STTQueryParams = {}) => {
  const queryParams = new URLSearchParams({
    order_by: params.order_by || 'created_at',
    order_dir: params.order_dir || 'desc',
    page: String(params.page || 1),
    limit: String(params.limit || 50),
  });

  const response = await apiClient.get<STTListResponse>(`/service/stt?${queryParams}`);
  return response.data;
};

const createSTT = async (formData: FormData) => {
  const response = await apiClient.post<STTCreateResponse>('/service/stt/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const deleteSTT = async (id: number) => {
  const response = await apiClient.delete(`/service/stt/${id}`);
  return response.data;
};

export const sttService = {
  getSTT,
  createSTT,
  deleteSTT,
};