import { useState } from 'react';
import { comicExportService, ExportFormat, ExportResponse } from '@/services/comic/comicExportService';

export type ExportStatus = 'idle' | 'requesting' | 'downloading' | 'success' | 'error';

interface UseComicExportReturn {
  exportComic: (
    projectId: number,
    projectName: string,
    format: ExportFormat
  ) => Promise<ExportResponse | null>;
  isExporting: boolean;
  exportStatus: ExportStatus;
  exportProgress: number;
  exportError: string | null;
  exportedUrl: string | null;
  resetExport: () => void;
}

export const useComicExport = (): UseComicExportReturn => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<ExportStatus>('idle');
  const [exportProgress, setExportProgress] = useState(0);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportedUrl, setExportedUrl] = useState<string | null>(null);

  const resetExport = () => {
    setIsExporting(false);
    setExportStatus('idle');
    setExportProgress(0);
    setExportError(null);
    setExportedUrl(null);
  };

  const exportComic = async (
    projectId: number,
    projectName: string,
    format: ExportFormat
  ): Promise<ExportResponse | null> => {
    setIsExporting(true);
    setExportStatus('requesting');
    setExportProgress(0);
    setExportError(null);
    setExportedUrl(null);

    try {
      // Step 1: Request export from backend (30%)
      setExportProgress(10);
      console.log(`🎬 Starting export process for "${projectName}" as ${format.toUpperCase()}...`);
      
      const response = await comicExportService.exportProject(projectId, format);
      
      setExportProgress(40);
      setExportedUrl(response.exported_url);
      
      if (!response.exported_url) {
        throw new Error('Backend did not return export URL');
      }

      // Step 2: Download file from URL (70%)
      setExportStatus('downloading');
      setExportProgress(50);
      
      const filename = `${projectName.replace(/\s+/g, '_')}.${format}`;
      await comicExportService.downloadFromUrl(response.exported_url, filename);
      
      // Step 3: Complete (100%)
      setExportProgress(100);
      setExportStatus('success');
      
      console.log('✅ Export completed successfully!');
      
      return response;
    } catch (error: any) {
      const errorMessage = error.message || `Failed to export comic as ${format.toUpperCase()}`;
      setExportError(errorMessage);
      setExportStatus('error');
      setExportProgress(0);
      
      console.error('❌ Export process failed:', error);
      
      return null;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportComic,
    isExporting,
    exportStatus,
    exportProgress,
    exportError,
    exportedUrl,
    resetExport,
  };
};