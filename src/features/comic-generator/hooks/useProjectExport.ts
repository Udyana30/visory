import { useState, useCallback } from 'react';
import { ExportFormat, ProcessStatus } from '../types/domain/review';
import { exportService } from '../services/exportService';

interface UseProjectExportReturn {
  exportProject: (projectId: number, format: ExportFormat, projectName: string) => Promise<void>;
  status: ProcessStatus;
  progress: number;
  error: string | null;
  downloadUrl: string | null;
  reset: () => void;
}

export const useProjectExport = (): UseProjectExportReturn => {
  const [status, setStatus] = useState<ProcessStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const reset = () => {
    setStatus('idle');
    setProgress(0);
    setError(null);
    setDownloadUrl(null);
  };

  const exportProject = useCallback(async (projectId: number, format: ExportFormat, projectName: string) => {
    setStatus('loading');
    setProgress(10);
    setError(null);

    try {
      const response = await exportService.triggerExport(projectId, format);
      
      if (!response.exported_url) {
        throw new Error('Server did not return a download URL');
      }

      setProgress(50);
      setDownloadUrl(response.exported_url);

      const safeName = projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const filename = `${safeName}.${format}`;
      
      await exportService.downloadFile(response.exported_url, filename);
      
      setProgress(100);
      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Export failed');
      setStatus('error');
    }
  }, []);

  return { exportProject, status, progress, error, downloadUrl, reset };
};