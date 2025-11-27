import React, { useState, useEffect, useMemo } from 'react';
import { PreviewPanel } from '../components/review/panels/PreviewPanel';
import { ExportPanel } from '../components/review/panels/ExportPanel';
import { GenerationLoader } from '../components/review/feedback/GenerationLoader';
import { TimelineProgress } from '../components/TimelineProgress';
import { useComicPages } from '@/hooks/comic/useComicPages';
import { usePreviewGeneration } from '../hooks/usePreviewGeneration';
import { useProjectExport } from '../hooks/useProjectExport';
import { ExportFormat } from '../types/domain/review';
import { ComicPage } from '../types/domain/editor';

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
  
  const { pages: legacyPages, isLoading: isLoadingPages } = useComicPages({ 
    projectId, 
    visualizations: [] 
  });
  
  const domainPages = useMemo<ComicPage[]>(() => {
    return legacyPages.map((p: any) => ({
      ...p,
      id: String(p.id),
      pageNumber: p.page_number || p.pageNumber || 0,
      previewUrl: p.preview_url || p.previewUrl || null,
      elements: p.elements || [],
      layout: p.layout || 'single',
      backgroundColor: p.background_color || p.backgroundColor || '#ffffff'
    }));
  }, [legacyPages]);

  const { 
    generateAllPreviews, 
    status: previewStatus, 
    progress: previewProgress, 
    generatedPreviews 
  } = usePreviewGeneration();

  const {
    exportProject,
    status: exportStatus,
    progress: exportProgress,
    error: exportError,
    downloadUrl,
    reset: resetExport
  } = useProjectExport();

  useEffect(() => {
    if (!projectId || isLoadingPages || domainPages.length === 0) return;
    
    const needsGeneration = previewStatus === 'idle' && (
      dirtyPageIds.size > 0 || domainPages.some(p => !p.previewUrl)
    );

    if (needsGeneration) {
      generateAllPreviews(projectId, domainPages).then(() => {
        domainPages.forEach(p => {
          if (dirtyPageIds.has(Number(p.id))) {
            onPreviewGenerated(Number(p.id));
          }
        });
      });
    }
  }, [
    projectId, 
    isLoadingPages, 
    domainPages,
    dirtyPageIds, 
    generateAllPreviews, 
    onPreviewGenerated, 
    previewStatus
  ]);

  const handleExport = (format: ExportFormat) => {
    if (projectId) exportProject(projectId, format, projectName);
  };

  if (previewStatus === 'loading' || isLoadingPages) {
    return (
      <GenerationLoader 
        progress={previewProgress} 
        currentPage={Math.ceil((previewProgress / 100) * domainPages.length)} 
        totalPages={domainPages.length} 
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-140px)]">
      <div className="lg:col-span-2 h-full overflow-hidden flex flex-col bg-white rounded-xl shadow-sm border border-gray-200">
        {viewMode === 'export' ? (
          <ExportPanel
            projectName={projectName}
            status={exportStatus}
            progress={exportProgress}
            error={exportError}
            url={downloadUrl}
            onExport={handleExport}
            onReset={resetExport}
          />
        ) : (
          <PreviewPanel
            pages={domainPages}
            previews={generatedPreviews}
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

        {viewMode === 'preview' ? (
          <button
            onClick={() => setViewMode('export')}
            className="w-full py-4 px-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            Proceed to Export
          </button>
        ) : (
          <button
            onClick={() => setViewMode('preview')}
            className="w-full py-4 px-6 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition font-bold flex items-center justify-center"
          >
            Back to Preview
          </button>
        )}
      </div>
    </div>
  );
};