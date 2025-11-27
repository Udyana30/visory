import apiClient from '@/lib/apiClient';
import { ExportResponse, ExportRequest } from '../types/api/review';
import { ExportFormat } from '../types/domain/review';

export const exportService = {
  triggerExport: async (projectId: number, format: ExportFormat): Promise<ExportResponse> => {
    const payload: ExportRequest = { export_format: format };
    const { data } = await apiClient.post<ExportResponse>(
      `/service/comic/projects/${projectId}/export`, 
      payload
    );
    return data;
  },

  downloadFile: async (url: string, filename: string): Promise<void> => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Download failed');
    
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  }
};