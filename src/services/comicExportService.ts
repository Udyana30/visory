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
    const response = await apiClient.post<ExportResponse>(
      `/service/comic/projects/${projectId}/export`,
      { export_format: format }
    );
    return response.data;
  },
};