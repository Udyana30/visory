export type ExportFormat = 'pdf' | 'cbz' | 'cbr' | 'epub';

export type ProcessStatus = 'idle' | 'loading' | 'success' | 'error';

export interface PreviewState {
  status: ProcessStatus;
  progress: number;
  currentProcessingId: number | null;
}

export interface ExportState {
  status: ProcessStatus;
  progress: number;
  downloadUrl: string | null;
  error: string | null;
}