import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { PreviewPanel } from '../components/review/panels/PreviewPanel';
import { ExportPanel } from '../components/review/panels/ExportPanel';
import { GenerationLoader } from '../components/review/feedback/GenerationLoader';
import { TimelineProgress } from '../components/TimelineProgress';
import { usePreviewGeneration } from '../hooks/usePreviewGeneration';
import { useProjectExport } from '../hooks/useProjectExport';
import { previewService } from '../services/previewService';
import { ExportFormat } from '../types/domain/review';
import { useEditor } from '../context/EditorContext';
import { Project } from '@/features/comic-generator/types/domain/project';
import { Image } from 'lucide-react';

interface ComicReviewProps {
  projectId: number | null;
  projectName?: string;
  onBack: () => void;
  currentTimelineStep: number;
  onStepClick: (step: number) => void;
  currentProject: Project | null;
}

export const ComicReview: React.FC<ComicReviewProps> = ({
  projectId,
  projectName = 'Untitled Comic',
  onBack,
  currentTimelineStep,
  onStepClick,
  currentProject
}) => {
  const [viewMode, setViewMode] = useState<'preview' | 'export'>('preview');
  const hasGeneratedRef = useRef(false);
  const [selectedThumbnailPageId, setSelectedThumbnailPageId] = useState<number | null>(null);
  const [isSettingThumbnail, setIsSettingThumbnail] = useState(false);

  const { state: editorState, actions } = useEditor();
  const pages = editorState.pages;
  const touchedPageIds = editorState.touchedPageIds;

  const {
    generatePreviews,
    status: previewStatus,
    progress: previewProgress,
    renderedPreviews,
    isProcessing
  } = usePreviewGeneration();

  const {
    exportProject,
    status: exportStatus,
    progress: exportProgress,
    error: exportError,
    downloadUrl,
    reset: resetExport
  } = useProjectExport();

  // Auto-select and SET page 1 as thumbnail via API call (with silent fail)
  useEffect(() => {
    if (!projectId || !pages.length || selectedThumbnailPageId !== null) return;

    const firstPage = pages[0];
    if (firstPage && firstPage.id && !isNaN(Number(firstPage.id))) {
      const pageId = Number(firstPage.id);
      setSelectedThumbnailPageId(pageId);

      // Silently set thumbnail on backend - fail gracefully if endpoint not available
      previewService.setThumbnail(projectId, pageId)
        .then(() => {
          console.log('✅ Auto-set thumbnail to page 1');
        })
        .catch((error) => {
          // Silent fail - endpoint might not be implemented yet
          console.warn('Thumbnail API not available yet:', error.message || 'Unknown error');
        });
    }
  }, [projectId, pages, selectedThumbnailPageId]);

  useEffect(() => {
    if (!projectId) return;
    if (pages.length === 0) {
      actions.loadProject(projectId);
    }
  }, [projectId, pages.length, actions]);

  const shouldGenerate = useMemo(() => {
    if (!projectId || !currentProject || pages.length === 0 || isProcessing) {
      return false;
    }
    const hasDirtyPages = touchedPageIds.size > 0;
    const hasMissingPreviews = pages.some(p => !p.previewUrl);

    return hasDirtyPages || hasMissingPreviews;
  }, [projectId, currentProject, pages, touchedPageIds, isProcessing]);

  useEffect(() => {
    if (!shouldGenerate || hasGeneratedRef.current) return;

    const executeGeneration = async () => {
      hasGeneratedRef.current = true;

      const dimensions = currentProject!.pageSize;
      const pagesToProcessIds = new Set(touchedPageIds);

      pages.forEach(p => {
        if (!p.previewUrl) pagesToProcessIds.add(p.id);
      });

      const newServerUrls = await generatePreviews(projectId!, pages, dimensions, pagesToProcessIds);

      if (Object.keys(newServerUrls).length > 0) {
        actions.updatePagePreviews(newServerUrls);
      }

      actions.markPreviewsGenerated();
      hasGeneratedRef.current = false;
    };

    executeGeneration();
  }, [shouldGenerate, projectId, currentProject, pages, touchedPageIds, generatePreviews, actions]);

  const displayPreviews = useMemo(() => {
    const combined: Record<string, string> = {};

    pages.forEach(page => {
      // 1. Jika halaman baru saja dimodifikasi/digenerate, gunakan BLOB lokal (Memory)
      // Ini menjamin update terlihat instan tanpa menunggu fetch ulang
      if (renderedPreviews[page.id]) {
        combined[page.id] = renderedPreviews[page.id];
        return;
      }

      // 2. Jika halaman tidak dimodifikasi, gunakan URL dari Backend (Storage)
      // PENTING: Jangan memodifikasi string URL (seperti menambah ?t=...) 
      // karena akan merusak Signature AWS/MinIO
      if (page.previewUrl) {
        combined[page.id] = page.previewUrl;
      }
    });

    return combined;
  }, [pages, renderedPreviews]);

  const handleExport = useCallback((format: ExportFormat, isPublic: boolean) => {
    if (projectId) {
      exportProject(projectId, format, projectName, isPublic);
    }
  }, [projectId, exportProject, projectName]);

  const handleSetThumbnail = async (pageId: number) => {
    if (!projectId) return;

    setIsSettingThumbnail(true);
    try {
      await previewService.setThumbnail(projectId, pageId);
      setSelectedThumbnailPageId(pageId);
    } catch (error: any) {
      console.error('Failed to set thumbnail:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Unknown error';
      alert(`Failed to set thumbnail: ${errorMessage}`);
    } finally {
      setIsSettingThumbnail(false);
    }
  };

  const handleRetry = useCallback(() => {
    hasGeneratedRef.current = false;
    const dimensions = currentProject!.pageSize;
    const allPageIds = new Set(pages.map(p => p.id));

    generatePreviews(projectId!, pages, dimensions, allPageIds).then(newServerUrls => {
      if (Object.keys(newServerUrls).length > 0) {
        actions.updatePagePreviews(newServerUrls);
      }
      actions.markPreviewsGenerated();
    });
  }, [projectId, currentProject, pages, generatePreviews, actions]);

  if (previewStatus === 'loading') {
    const dirtyCount = pages.filter(p => touchedPageIds.has(p.id) || !p.previewUrl).length;
    const currentStep = Math.ceil((previewProgress / 100) * dirtyCount) || 1;

    return (
      <GenerationLoader
        progress={previewProgress}
        currentPage={currentStep}
        totalPages={dirtyCount}
      />
    );
  }

  if (previewStatus === 'error') {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-xl border border-red-200">
          <h3 className="text-lg font-bold text-red-700">Failed to Generate Previews</h3>
          <p className="text-red-600 mb-4">An error occurred while rendering your comic.</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-100px)] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] h-full gap-6">
        <div className="h-full overflow-y-auto bg-white rounded-xl shadow-sm border border-gray-200 custom-scrollbar flex flex-col">
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
              pages={pages}
              previews={displayPreviews}
              selectedThumbnailPageId={selectedThumbnailPageId}
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
            <>
              <button
                onClick={() => setViewMode('export')}
                disabled={isProcessing}
                className="w-full py-3.5 px-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Export
              </button>

              {/* Thumbnail Selection */}
              {pages.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <Image className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Project Thumbnail
                    </h3>
                  </div>
                  <select
                    value={selectedThumbnailPageId || ''}
                    onChange={(e) => handleSetThumbnail(parseInt(e.target.value))}
                    disabled={isSettingThumbnail}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {pages.map(page => (
                      <option key={page.id} value={Number(page.id)}>
                        Page {page.pageNumber}
                        {selectedThumbnailPageId === Number(page.id) ? ' ✓' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => setViewMode('preview')}
              className="w-full py-3.5 px-6 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition font-bold flex items-center justify-center"
            >
              Back to Preview
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
