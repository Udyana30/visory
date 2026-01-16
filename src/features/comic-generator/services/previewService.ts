import apiClient from '@/lib/apiClient';
import { PreviewResponse } from '../types/api/review';

export const previewService = {
  uploadPagePreview: async (projectId: number, pageId: number, blob: Blob): Promise<string> => {
    const uniqueId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now();
    const filename = `preview_${pageId}_${uniqueId}.png`;

    const formData = new FormData();
    formData.append('file', blob, filename);

    const { data } = await apiClient.post<PreviewResponse>(
      `/service/comic/projects/${projectId}/pages/${pageId}/preview`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return data.preview_url;
  },

  // Set page as project thumbnail
  setThumbnail: async (projectId: number, pageId: number): Promise<void> => {
    await apiClient.put(
      `/service/comic/projects/${projectId}/pages/${pageId}/thumbnail`
    );
  }
};