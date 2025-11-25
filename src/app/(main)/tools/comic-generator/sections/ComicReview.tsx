import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PreviewPanel } from '../components/review/PreviewPanel';
import { ExportPanel } from '../components/review/ExportPanel';
import { TimelineProgress } from '../components/TimelineProgress';
import { useComicPages } from '@/hooks/comic/useComicPages';
import { useComicExport } from '@/hooks/comic/useComicExport';
import { comicPreviewService } from '@/services/comic/comicPreviewService';
import { renderPageToCanvas } from '@/app/(main)/tools/comic-generator/lib/canvasRenderer';
import { ExportFormat } from '@/services/comic/comicExportService';
import { ComicPage } from '@/app/(main)/tools/comic-generator/types/editor';

interface ComicReviewProps {
  projectId: number | null;
  projectName?: string;
  onBack: () => void;
  currentTimelineStep: number;
  onStepClick: (step: number) => void;
  dirtyPageIds: Set<number>;
  onPreviewGenerated: (pageId: number) => void;
}

export const ComicReview: React.FC<ComicReviewProps> = ({
  projectId,
  projectName = 'Untitled Comic',
  onBack,
  currentTimelineStep,
  onStepClick,
  dirtyPageIds,
  onPreviewGenerated
}) => {
  const [viewMode, setViewMode] = useState<'preview' | 'export'>('preview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [processedPages, setProcessedPages] = useState<Set<number>>(new Set());

  const emptyVisualizations = useMemo(() => [], []);
  
  const { pages, setPages, isLoading: isLoadingPages } = useComicPages({
    projectId,
    visualizations: emptyVisualizations
  });

  const {
    exportComic,
    isExporting,
    exportStatus,
    exportProgress,
    exportError,
    exportedUrl
  } = useComicExport();

  const generatePreviews = useCallback(async (pagesToRender: ComicPage[]) => {
    if (!projectId || pagesToRender.length === 0) return;

    setIsGenerating(true);
    setGenerationProgress(0);
    const total = pagesToRender.length;

    try {
      for (let i = 0; i < total; i++) {
        const page = pagesToRender[i];
        const progress = Math.round(((i + 1) / total) * 100);
        setGenerationProgress(progress);

        if (!page.id) continue;

        const blob = await renderPageToCanvas(page);
        const response = await comicPreviewService.generatePreview(projectId, page.id, blob);

        setPages(prev => prev.map(p => 
          p.id === page.id ? { ...p, preview_url: response.preview_url } : p
        ));
        
        setProcessedPages(prev => new Set(prev).add(page.id));
        onPreviewGenerated(page.id);
      }
    } catch (error) {
      console.error('Preview generation failed:', error);
    } finally {
      setGenerationProgress(100);
      setTimeout(() => {
        setIsGenerating(false);
      }, 500);
    }
  }, [projectId, setPages, onPreviewGenerated]);

  useEffect(() => {
    if (!isLoadingPages && pages.length > 0 && !isGenerating) {
      const pagesNeedingUpdate = pages.filter(p => 
        !p.preview_url || dirtyPageIds.has(p.id)
      );
      
      const uniquePagesToProcess = pagesNeedingUpdate.filter(p => !processedPages.has(p.id));

      if (uniquePagesToProcess.length > 0) {
        generatePreviews(uniquePagesToProcess);
      }
    }
  }, [isLoadingPages, pages, isGenerating, processedPages, generatePreviews, dirtyPageIds]);

  const handleExport = async (format: ExportFormat) => {
    if (!projectId) return;
    await exportComic(projectId, projectName, format);
  };

  if (isGenerating || isLoadingPages) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white rounded-xl border border-gray-200 shadow-sm p-12">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
            <div 
              className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"
            ></div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Generating Previews...
            </h3>
            <p className="text-gray-500 mb-6">
              Rendering page {Math.ceil((generationProgress / 100) * pages.length)} of {pages.length}
            </p>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${generationProgress}%` }}
            />
          </div>
          <p className="text-sm font-medium text-blue-600">{generationProgress}% Complete</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-140px)]">
      <div className="lg:col-span-2 h-full overflow-hidden flex flex-col bg-white rounded-xl shadow-sm border border-gray-200">
        {viewMode === 'export' ? (
          <ExportPanel
            projectName={projectName}
            onExport={handleExport}
            isExporting={isExporting}
            exportStatus={exportStatus}
            exportProgress={exportProgress}
            exportError={exportError}
            exportedUrl={exportedUrl}
        />
        ) : (
          <PreviewPanel
            pages={pages}
            onContinue={() => setViewMode('export')}
            onBack={onBack}
          />
        )}
      </div>

      <div className="space-y-4 sticky top-0 self-start">
        <TimelineProgress
          currentProgress={100}
          currentTimelineStep={currentTimelineStep}
          onStepClick={onStepClick}
          isComicOverviewComplete={true}
        />

        {viewMode === 'preview' && (
          <button
            onClick={() => setViewMode('export')}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-600/20 flex items-center justify-center text-sm"
          >
            Export Project
          </button>
        )}
      </div>
    </div>
  );
};