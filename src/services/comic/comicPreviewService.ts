import apiClient from '@/lib/apiClient';

export interface PreviewResponse {
  preview_url: string;
}

export const comicPreviewService = {
  generatePreview: async (
    projectId: number,
    pageId: number,
    imageBlob: Blob
  ): Promise<PreviewResponse> => {
    const formData = new FormData();
    formData.append('file', imageBlob, 'preview.png');

    const response = await apiClient.post<PreviewResponse>(
      `/service/comic/projects/${projectId}/pages/${pageId}/preview`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  },
};