import React, { useState, useEffect } from 'react';
import { Upload, Info, Save, Clock } from 'lucide-react';
import { DndProvider } from '../components/editor/DndProvider';
import { EditorToolbar } from '../components/editor/EditorToolbar';
import { EditorCanvas } from '../components/editor/EditorCanvas';
import { PropertiesPanel } from '../components/editor/PropertiesPanel';
import { ImageGallery } from '../components/editor/ImageGallery';
import { PagesSidebar } from '../components/editor/PagesSidebar';
import { SaveModal } from '../components/editor/SaveModal';
import { ExportModal } from '../components/editor/ExportModal';
import { ComicPage, ComicPanel, SpeechBubble, SceneVisualization } from '@/types/editor';
import { 
  createEmptyPage, 
  createPanelsFromLayout, 
  clonePages, 
  findBubbleInPage,
  createDefaultBubble 
} from '@/lib/editorUtils';
import { usePagePersistence } from '@/hooks/usePagePersistence';
import { useComicExport } from '@/hooks/useComicExport';
import { ExportFormat } from '@/services/comicExportService';

interface ComicEditorProps {
  visualizations: SceneVisualization[];
  projectId: number | null;
  projectName?: string;
  onBack: () => void;
  onNext: () => void;
}

export const ComicEditor: React.FC<ComicEditorProps> = ({
  visualizations,
  projectId,
  projectName = 'Untitled Comic',
  onBack,
  onNext
}) => {
  const [pages, setPages] = useState<ComicPage[]>(() => {
    if (visualizations.length === 0) {
      return [createEmptyPage()];
    }
    
    return visualizations
      .filter(viz => viz.imageUrl)
      .map((viz, index) => ({
        id: `page-${index + 1}`,
        layout: 'single' as const,
        backgroundColor: '#ffffff',
        panels: [{
          id: `panel-${index}-0`,
          imageUrl: viz.imageUrl || '',
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          rotation: 0,
          bubbles: []
        }]
      }));
  });

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [activeTool, setActiveTool] = useState<'select' | 'bubble' | 'text' | 'image' | 'layout' | 'custom-panel'>('select');
  const [selectedBubbleId, setSelectedBubbleId] = useState<string | null>(null);
  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(0.8);
  const [history, setHistory] = useState<ComicPage[][]>([clonePages(pages)]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showExportModal, setShowExportModal] = useState(false);

  const {
    savePage,
    loadPage,
    isSaving,
    isLoading,
    lastSaved,
    saveError
  } = usePagePersistence({
    projectId,
    currentPageIndex,
    pages,
  });

  const {
    exportComic,
    isExporting,
    exportProgress,
    exportError
  } = useComicExport();

  const currentPage = pages[currentPageIndex] || createEmptyPage();

  useEffect(() => {
    const initializePage = async () => {
      if (!projectId) return;

      const loadedPage = await loadPage(currentPageIndex);
      if (loadedPage) {
        const newPages = [...pages];
        newPages[currentPageIndex] = loadedPage;
        setPages(newPages);
      }
    };

    initializePage();
  }, [currentPageIndex, projectId]);

  const addToHistory = (newPages: ComicPage[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(clonePages(newPages));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleSave = async () => {
    await savePage(currentPageIndex);
  };

  const handlePageSelect = async (index: number) => {
    setCurrentPageIndex(index);
  };

  const handlePageAdd = () => {
    const newPages = [...pages, createEmptyPage()];
    setPages(newPages);
    addToHistory(newPages);
    setCurrentPageIndex(newPages.length - 1);
  };

  const handlePageDelete = async (index: number) => {
    if (pages.length === 1) return;
    
    const newPages = pages.filter((_, i) => i !== index);
    setPages(newPages);
    addToHistory(newPages);
    
    if (currentPageIndex >= newPages.length) {
      setCurrentPageIndex(newPages.length - 1);
    }
  };

  const handleLayoutChange = (layout: string) => {
    if (layout === 'custom') {
      const newPages = pages.map((page, idx) =>
        idx === currentPageIndex
          ? { ...page, layout: 'custom' as const, panels: [] }
          : page
      );
      setPages(newPages);
      addToHistory(newPages);
      setActiveTool('custom-panel');
      setSelectedPanelId(null);
      setSelectedBubbleId(null);
      return;
    }

    const newPanels = createPanelsFromLayout(layout, currentPage.panels);
    const newPages = pages.map((page, idx) =>
      idx === currentPageIndex
        ? { ...page, layout: layout as any, panels: newPanels }
        : page
    );
    setPages(newPages);
    addToHistory(newPages);
    setSelectedPanelId(null);
  };

  const handleCustomPanelAdd = (x: number, y: number, width: number, height: number) => {
    const newPanel = {
      id: `panel-${Date.now()}`,
      imageUrl: '',
      x,
      y,
      width,
      height,
      rotation: 0,
      bubbles: [],
      isCustom: true
    };

    const newPages = pages.map((page, idx) =>
      idx === currentPageIndex
        ? { ...page, panels: [...page.panels, newPanel] }
        : page
    );

    setPages(newPages);
    addToHistory(newPages);
  };

  const handlePanelUpdate = (updatedPanel: ComicPanel) => {
    const newPages = pages.map((page, idx) =>
      idx === currentPageIndex
        ? {
            ...page,
            panels: page.panels.map(panel =>
              panel.id === updatedPanel.id ? updatedPanel : panel
            )
          }
        : page
    );
    setPages(newPages);
  };

  const handlePanelUpdateComplete = () => {
    addToHistory(pages);
  };

  const handlePanelSwap = (sourcePanelId: string, targetPanelId: string) => {
    const newPages = pages.map((page, idx) => {
      if (idx !== currentPageIndex) return page;

      const sourceIndex = page.panels.findIndex(p => p.id === sourcePanelId);
      const targetIndex = page.panels.findIndex(p => p.id === targetPanelId);

      if (sourceIndex === -1 || targetIndex === -1) return page;

      const newPanels = [...page.panels];
      const sourceImageUrl = newPanels[sourceIndex].imageUrl;
      const targetImageUrl = newPanels[targetIndex].imageUrl;

      newPanels[sourceIndex] = { ...newPanels[sourceIndex], imageUrl: targetImageUrl };
      newPanels[targetIndex] = { ...newPanels[targetIndex], imageUrl: sourceImageUrl };

      return { ...page, panels: newPanels };
    });

    setPages(newPages);
    addToHistory(newPages);
  };

  const handleImageDrop = (panelId: string, imageUrl: string) => {
    const newPages = pages.map((page, idx) =>
      idx === currentPageIndex
        ? {
            ...page,
            panels: page.panels.map(panel =>
              panel.id === panelId ? { ...panel, imageUrl } : panel
            )
          }
        : page
    );
    setPages(newPages);
    addToHistory(newPages);
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const imageUrl = URL.createObjectURL(file);
    
    const emptyPanel = currentPage.panels.find(p => !p.imageUrl);
    if (emptyPanel) {
      handleImageDrop(emptyPanel.id, imageUrl);
    }
  };

  const handleBubbleAdd = (panelId: string, x: number, y: number, template?: Partial<SpeechBubble>) => {
    const newBubble: SpeechBubble = {
      ...createDefaultBubble(x, y),
      ...template
    };

    const newPages = pages.map((page, idx) =>
      idx === currentPageIndex
        ? {
            ...page,
            panels: page.panels.map(panel =>
              panel.id === panelId
                ? { ...panel, bubbles: [...panel.bubbles, newBubble] }
                : panel
            )
          }
        : page
    );

    setPages(newPages);
    addToHistory(newPages);
    setSelectedBubbleId(newBubble.id);
    setSelectedPanelId(null);
    setActiveTool('select');
  };

  const handleBubbleUpdate = (panelId: string, updatedBubble: SpeechBubble) => {
    const newPages = pages.map((page, idx) =>
      idx === currentPageIndex
        ? {
            ...page,
            panels: page.panels.map(panel =>
              panel.id === panelId
                ? {
                    ...panel,
                    bubbles: panel.bubbles.map(bubble =>
                      bubble.id === updatedBubble.id ? updatedBubble : bubble
                    )
                  }
                : panel
            )
          }
        : page
    );
    setPages(newPages);
  };

  const handleBubbleUpdateComplete = (updatedBubble: SpeechBubble) => {
    const result = findBubbleInPage(currentPage, updatedBubble.id);
    if (!result) return;
    handleBubbleUpdate(result.panel.id, updatedBubble);
    addToHistory(pages);
  };

  const handleDelete = () => {
    if (selectedBubbleId) {
      const newPages = pages.map((page, idx) =>
        idx === currentPageIndex
          ? {
              ...page,
              panels: page.panels.map(panel => ({
                ...panel,
                bubbles: panel.bubbles.filter(bubble => bubble.id !== selectedBubbleId)
              }))
            }
          : page
      );

      setPages(newPages);
      addToHistory(newPages);
      setSelectedBubbleId(null);
      return;
    }

    if (selectedPanelId) {
      const selectedPanel = currentPage.panels.find(p => p.id === selectedPanelId);
      
      if (selectedPanel?.imageUrl) {
        const newPages = pages.map((page, idx) =>
          idx === currentPageIndex
            ? {
                ...page,
                panels: page.panels.map(panel =>
                  panel.id === selectedPanelId ? { ...panel, imageUrl: '' } : panel
                )
              }
            : page
        );
        setPages(newPages);
        addToHistory(newPages);
      } else if (currentPage.layout === 'custom') {
        const newPages = pages.map((page, idx) =>
          idx === currentPageIndex
            ? {
                ...page,
                panels: page.panels.filter(panel => panel.id !== selectedPanelId)
              }
            : page
        );
        setPages(newPages);
        addToHistory(newPages);
        setSelectedPanelId(null);
      }
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setPages(clonePages(history[historyIndex - 1]));
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setPages(clonePages(history[historyIndex + 1]));
    }
  };

  const handleZoomIn = () => setZoom(Math.min(2, zoom + 0.1));
  const handleZoomOut = () => setZoom(Math.max(0.3, zoom - 0.1));

  const handleExport = () => {
    setShowExportModal(true);
  };

  const handleExportConfirm = async (format: ExportFormat) => {
    if (!projectId) {
      alert('Project ID is required for export');
      return;
    }

    const exportUrl = await exportComic(
      projectId,
      projectName,
      pages,
      format,
      { width: 800, height: 1280 }
    );

    if (!exportError) {
      setTimeout(() => {
        setShowExportModal(false);
      }, 1500);
    }
  };

  const handleCanvasClick = () => {
    setSelectedBubbleId(null);
    setSelectedPanelId(null);
    if (activeTool === 'custom-panel') return;
    setActiveTool('select');
  };

  const handleToolChange = (tool: typeof activeTool) => {
    setActiveTool(tool);
    if (tool !== 'custom-panel' && currentPage.layout !== 'custom') {
      setSelectedPanelId(null);
    }
    if (tool !== 'bubble' && tool !== 'select') {
      setSelectedBubbleId(null);
    }
  };

  const getSelectedBubble = (): SpeechBubble | null => {
    if (!selectedBubbleId) return null;
    const result = findBubbleInPage(currentPage, selectedBubbleId);
    return result ? result.bubble : null;
  };

  const getSelectedPanel = (): ComicPanel | null => {
    if (!selectedPanelId) return null;
    return currentPage.panels.find(p => p.id === selectedPanelId) || null;
  };

  const hasNoImages = visualizations.length === 0 || visualizations.every(v => !v.imageUrl);

  useEffect(() => {
    const handleMouseUp = () => {
      handlePanelUpdateComplete();
    };

    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [pages]);

  return (
    <DndProvider>
      <div className="h-screen flex flex-col bg-gray-50">
        <EditorToolbar
          activeTool={activeTool}
          onToolChange={handleToolChange}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onDelete={handleDelete}
          onExport={handleExport}
          onSave={handleSave}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          zoom={zoom}
          isSaving={isSaving}
          isCustomPanelDisabled={currentPage.layout !== 'custom'}
        />

        {saveError && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex items-center gap-3">
            <Info className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800">
              <strong>Save Error:</strong> {saveError}
            </p>
          </div>
        )}

        {lastSaved && !isSaving && (
          <div className="bg-green-50 border-b border-green-200 px-6 py-2 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-green-600" />
            <p className="text-xs text-green-800">
              Last saved: {lastSaved.toLocaleTimeString()}
            </p>
          </div>
        )}

        <div className="flex-1 flex overflow-hidden">
          <div className="w-72 bg-white border-r border-gray-200 flex flex-col overflow-y-auto scrollbar-minimal">
            <ImageGallery 
              visualizations={visualizations}
              onImageUpload={handleImageUpload}
            />
            <PagesSidebar
              pages={pages}
              currentPageIndex={currentPageIndex}
              onPageSelect={handlePageSelect}
              onPageAdd={handlePageAdd}
              onPageDelete={handlePageDelete}
            />
          </div>

          {hasNoImages ? (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center max-w-md px-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Scenes Available</h3>
                <p className="text-gray-600 mb-6">
                  Please generate scenes from the Scene Visualization step or upload images from your computer to start creating your comic.
                </p>
                <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
                  <Upload className="w-5 h-5" />
                  Upload Images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              {activeTool === 'custom-panel' && currentPage.layout === 'custom' && (
                <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 flex items-center gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    <strong>Custom Panel Mode:</strong> Click and drag on the canvas to draw custom panels. Each panel can be resized as needed.
                  </p>
                </div>
              )}
              {currentPage.layout === 'custom' && activeTool === 'select' && (
                <div className="bg-green-50 border-b border-green-200 px-6 py-3 flex items-center gap-3">
                  <Info className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-green-800">
                    <strong>Edit Mode:</strong> Click on panels to select, then drag to move or use corner handles to resize. Press Delete to remove image or panel.
                  </p>
                </div>
              )}
              {isLoading && (
                <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                  <p className="text-sm text-blue-800">Loading page...</p>
                </div>
              )}
              <EditorCanvas
                page={currentPage}
                zoom={zoom}
                activeTool={activeTool}
                selectedBubbleId={selectedBubbleId}
                selectedPanelId={selectedPanelId}
                onBubbleSelect={setSelectedBubbleId}
                onPanelSelect={setSelectedPanelId}
                onBubbleUpdate={handleBubbleUpdate}
                onPanelUpdate={handlePanelUpdate}
                onBubbleAdd={handleBubbleAdd}
                onImageDrop={handleImageDrop}
                onCanvasClick={handleCanvasClick}
                onPanelSwap={handlePanelSwap}
                onCustomPanelAdd={handleCustomPanelAdd}
              />
            </div>
          )}

          <PropertiesPanel
            selectedBubble={getSelectedBubble()}
            selectedPanel={getSelectedPanel()}
            onBubbleUpdate={handleBubbleUpdateComplete}
            onPanelUpdate={(panel) => {
              handlePanelUpdate(panel);
              handlePanelUpdateComplete();
            }}
            onLayoutChange={handleLayoutChange}
            currentLayout={currentPage.layout}
            onBubbleAdd={handleBubbleAdd}
            currentPagePanels={currentPage.panels}
            onDeselectBubble={() => setSelectedBubbleId(null)}
            onDeselectPanel={() => setSelectedPanelId(null)}
          />
        </div>

        <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="px-6 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-medium"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
          >
            Preview & Export
          </button>
        </div>

        <SaveModal isOpen={isSaving} />
        
        <ExportModal
          isOpen={showExportModal}
          onClose={() => !isExporting && setShowExportModal(false)}
          onExport={handleExportConfirm}
          isExporting={isExporting}
          exportProgress={exportProgress}
          exportError={exportError}
        />
      </div>
    </DndProvider>
  );
};