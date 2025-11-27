export interface PreviewResponse {
  preview_url: string;
}

export interface ExportRequest {
  export_format: 'pdf' | 'cbz' | 'cbr' | 'epub';
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