import apiClient from '@/lib/apiClient';
import { PreviewResponse } from '../types/api/review';

export const previewService = {
  uploadPagePreview: async (projectId: number, pageId: number, blob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append('file', blob, `preview_${pageId}.png`);

    const { data } = await apiClient.post<PreviewResponse>(
      `/service/comic/projects/${projectId}/pages/${pageId}/preview`, 
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    
    return data.preview_url;
  }
};