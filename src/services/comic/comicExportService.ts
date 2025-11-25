import apiClient from '@/lib/apiClient';

export type ExportFormat = 'pdf' | 'cbz' | 'cbr' | 'epub';

export interface ExportRequest {
  export_format: ExportFormat;
}

export interface ExportResponse {
  id: number;
  name: string;
  page_size: {
    width: number;
    height: number;
  };
  art_style: string;
  exported_url: string;
  created_at: string;
  updated_at: string;
}

export const comicExportService = {
  exportProject: async (
    projectId: number,
    format: ExportFormat
  ): Promise<ExportResponse> => {
    try {
      console.log(`📤 Requesting export for project ${projectId} as ${format.toUpperCase()}...`);
      
      const response = await apiClient.post<ExportResponse>(
        `/service/comic/projects/${projectId}/export`,
        { export_format: format }
      );
      
      console.log('✅ Export response received:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Export API failed:', {
        message: error.message,
        status: error.status,
        data: error.data
      });
      throw error;
    }
  },

  downloadFromUrl: async (url: string, filename: string): Promise<void> => {
    try {
      console.log(`⬇️ Downloading file: ${filename}`);
      
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      
      console.log('✅ File downloaded successfully:', filename);
    } catch (error: any) {
      console.error('❌ Download failed:', error);
      throw new Error(`Failed to download file: ${error.message}`);
    }
  }
};