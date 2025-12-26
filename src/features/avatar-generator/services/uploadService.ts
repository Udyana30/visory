import { avatarApiClient } from '@/lib/apiClient';

export interface UploadResponse {
  id_file: string;
  url: string;
  type: string;
}

export const uploadService = {
  uploadFile: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const resourceType = file.type.startsWith('audio') ? 'audio' : 'image';
    formData.append('resource_type', resourceType);

    const response = await avatarApiClient.post<UploadResponse>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  deleteFile: async (fileId: string): Promise<void> => {
    await avatarApiClient.delete(`/upload/${fileId}`);
  }
};