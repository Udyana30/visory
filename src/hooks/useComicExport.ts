import { useState } from 'react';
import { ComicPage } from '@/types/editor';
import { comicExportService, ExportFormat } from '@/services/comicExportService';
import {
  renderPagesToPDF,
  renderPagesToCBZ,
  renderPagesToCBR,
  renderPagesToEPUB,
  RenderOptions,
} from '@/lib/comicRenderer';

interface UseComicExportReturn {
  exportComic: (
    projectId: number,
    projectName: string,
    pages: ComicPage[],
    format: ExportFormat,
    options?: Partial<RenderOptions>
  ) => Promise<string | null>;
  isExporting: boolean;
  exportProgress: number;
  exportError: string | null;
}

export const useComicExport = (): UseComicExportReturn => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportError, setExportError] = useState<string | null>(null);

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderPages = async (
    pages: ComicPage[],
    format: ExportFormat,
    projectName: string,
    options?: Partial<RenderOptions>
  ): Promise<Blob> => {
    switch (format) {
      case 'pdf':
        return await renderPagesToPDF(pages, options);
      case 'cbz':
        return await renderPagesToCBZ(pages, options);
      case 'cbr':
        return await renderPagesToCBR(pages, options);
      case 'epub':
        return await renderPagesToEPUB(pages, projectName, options);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  };

  const exportComic = async (
    projectId: number,
    projectName: string,
    pages: ComicPage[],
    format: ExportFormat,
    options?: Partial<RenderOptions>
  ): Promise<string | null> => {
    setIsExporting(true);
    setExportProgress(0);
    setExportError(null);

    try {
      setExportProgress(10);

      const blob = await renderPages(pages, format, projectName, options);

      setExportProgress(70);

      let exportUrl: string | null = null;
      
      try {
        const response = await comicExportService.exportProject(projectId, format);
        exportUrl = response.exported_url;
        setExportProgress(90);
      } catch (apiError: any) {
        console.warn('API export notification failed, but file will still be downloaded:', apiError.message);
        setExportProgress(90);
      }

      const filename = `${projectName.replace(/\s+/g, '_')}.${format}`;
      downloadBlob(blob, filename);

      setExportProgress(100);

      return exportUrl;
    } catch (error: any) {
      const errorMessage = error.message || `Failed to export comic as ${format.toUpperCase()}`;
      setExportError(errorMessage);
      console.error('Export error:', error);
      return null;
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportProgress(0), 1000);
    }
  };

  return {
    exportComic,
    isExporting,
    exportProgress,
    exportError,
  };
};