import React, { useState, useEffect } from 'react';
import { Info, Upload } from 'lucide-react';
import { DndProvider } from '../components/editor/DndProvider';
import { EditorToolbar } from '../components/editor/EditorToolbar';
import { EditorCanvas } from '../components/editor/EditorCanvas';
import { PropertiesPanel } from '../components/editor/properties/PropertiesPanel';
import { ImageGallery } from '../components/editor/ImageGallery';
import { PagesSidebar } from '../components/editor/PagesSidebar';
import { SaveModal } from '../components/editor/SaveModal';
import { ComicPage, ComicPanel, SpeechBubble, SceneVisualization } from '@/app/(main)/tools/comic-generator/types/editor';
import { 
  createEmptyPage,
  createPanelsFromLayout, 
  clonePages, 
  createDefaultBubble 
} from '@/app/(main)/tools/comic-generator/lib/editorUtils';
import { useComicPages } from '@/hooks/comic/useComicPages';
import { usePagePersistence } from '@/hooks/comic/usePagePersistence';

interface ComicEditorProps {
  visualizations: SceneVisualization[];
  projectId: number | null;
  projectName?: string;
  onBack: () => void;
  onNext: () => void;
  onPageModified: (pageId: number) => void;
}

export const ComicEditor: React.FC<ComicEditorProps> = ({
  visualizations,
  projectId,
  onBack,
  onNext,
  onPageModified
}) => {
  const {
    pages,
    setPages,
    isLoading: isPagesLoading,
    error: pagesError,
    createNewPage,
    deletePage: deletePageFromBackend,
    reorderPages,
  } = useComicPages({
    projectId,
    visualizations
  });

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [activeTool, setActiveTool] = useState<'select' | 'bubble' | 'text' | 'image' | 'layout' | 'custom-panel'>('select');
  const [selectedBubbleId, setSelectedBubbleId] = useState<string | null>(null);
  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(0.8);
  const [history, setHistory] = useState<ComicPage[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const {
    saveDirtyPages,
    saveAllPages,
    markPageAsDirty,
    isSaving,
    isAutoSaving,
    saveError,
    hasDirtyPages
  } = usePagePersistence({
    projectId,
    pages,
  });

  const currentPage = pages[currentPageIndex] || createEmptyPage(1);

  useEffect(() => {
    if (pages.length > 0 && history.length === 0) {
      setHistory([clonePages(pages)]);
      setHistoryIndex(0);
    }
  }, [pages.length, history.length]);

  const triggerVisualDirty = () => {
    if (currentPage?.id) {
      onPageModified(currentPage.id);
    }
  };

  const addToHistory = (newPages: ComicPage[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(clonePages(newPages));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    markPageAsDirty(currentPageIndex);
  };

  const handleFinish = async () => {
    if (projectId) {
      await saveAllPages();
    }
    onNext();
  };

  const handleManualSave = async () => {
    setShowSaveSuccess(false);
    await saveDirtyPages(false);
    if (!saveError) {
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 2000);
    }
  };

  const handleBubbleSelect = (id: string | null) => { 
    setSelectedBubbleId(id); 
    if(id) setSelectedPanelId(null); 
  };
  
  const handlePanelSelect = (id: string | null) => { 
    setSelectedPanelId(id); 
    if(id) setSelectedBubbleId(null); 
  };

  const handlePageSelect = async (idx: number) => { 
    if (currentPageIndex === idx) return; 
    if(projectId && hasDirtyPages) await saveDirtyPages(true); 
    setCurrentPageIndex(idx); 
  };

  const handlePageAdd = async () => { 
    if(projectId && hasDirtyPages) await saveDirtyPages(true); 
    await createNewPage(); 
    setCurrentPageIndex(pages.length); 
  };

  const handlePageDelete = async (idx: number) => { 
    if(pages.length === 1 || isDeleting) return; 
    setIsDeleting(true); 
    await deletePageFromBackend(idx); 
    setIsDeleting(false); 
    if(currentPageIndex >= pages.length - 1) setCurrentPageIndex(Math.max(0, pages.length - 2));
  };

  const handlePageReorder = async (f: number, t: number) => { 
    await reorderPages(f, t); 
  };

  const handleZoomIn = () => setZoom(Math.min(2, zoom + 0.1));
  const handleZoomOut = () => setZoom(Math.max(0.3, zoom - 0.1));
  
  const handleUndo = () => { 
    if(historyIndex > 0) { 
      setHistoryIndex(historyIndex - 1); 
      setPages(clonePages(history[historyIndex - 1])); 
      markPageAsDirty(currentPageIndex);
      triggerVisualDirty();
    }
  };

  const handleRedo = () => { 
    if(historyIndex < history.length - 1) { 
      setHistoryIndex(historyIndex + 1); 
      setPages(clonePages(history[historyIndex + 1])); 
      markPageAsDirty(currentPageIndex);
      triggerVisualDirty();
    }
  };

  const handleDelete = () => { 
    if (selectedBubbleId) {
      const newPages = pages.map((page, idx) =>
        idx === currentPageIndex
          ? { ...page, bubbles: (page.bubbles || []).filter(b => b.id !== selectedBubbleId) }
          : page
      );
      setPages(newPages);
      addToHistory(newPages);
      setSelectedBubbleId(null);
      triggerVisualDirty();
    } else if (selectedPanelId) {
      const selectedPanel = currentPage.panels.find(p => p.id === selectedPanelId);
      if (selectedPanel?.imageUrl) {
        const newPages = pages.map((page, idx) =>
          idx === currentPageIndex
            ? { ...page, panels: page.panels.map(p => p.id === selectedPanelId ? { ...p, imageUrl: '' } : p) }
            : page
        );
        setPages(newPages);
        addToHistory(newPages);
        triggerVisualDirty();
      } else if (currentPage.layout === 'custom') {
        const newPages = pages.map((page, idx) =>
          idx === currentPageIndex
            ? { ...page, panels: page.panels.filter(p => p.id !== selectedPanelId) }
            : page
        );
        setPages(newPages);
        addToHistory(newPages);
        setSelectedPanelId(null);
        triggerVisualDirty();
      }
    }
  };

  const handleToolChange = (tool: any) => {
    setActiveTool(tool);
    if (tool !== 'custom-panel' && currentPage.layout !== 'custom') setSelectedPanelId(null);
    if (tool !== 'bubble' && tool !== 'select') setSelectedBubbleId(null);
  };

  const handleImageUpload = (files: FileList | null) => { 
    if (!files || files.length === 0) return;
    const file = files[0];
    const imageUrl = URL.createObjectURL(file);
    const emptyPanel = currentPage.panels.find(p => !p.imageUrl);
    if (emptyPanel) handleImageDrop(emptyPanel.id, imageUrl);
  };

  const handleLayoutChange = (layout: string) => { 
    if (layout === 'custom') {
      const newPages = pages.map((page, idx) =>
        idx === currentPageIndex ? { ...page, layout: 'custom' as const, panels: [] } : page
      );
      setPages(newPages);
      addToHistory(newPages);
      setActiveTool('custom-panel');
      triggerVisualDirty();
      return;
    }
    const newPanels = createPanelsFromLayout(layout, currentPage.panels);
    const newPages = pages.map((page, idx) =>
      idx === currentPageIndex ? { ...page, layout: layout as ComicPage['layout'], panels: newPanels } : page
    );
    setPages(newPages);
    addToHistory(newPages);
    triggerVisualDirty();
  };

  const handleCustomPanelAdd = (x: number, y: number, width: number, height: number) => { 
    const newPanel = {
      id: `panel-${Date.now()}`, imageUrl: '', x, y, width, height, rotation: 0, isCustom: true
    };
    const newPages = pages.map((page, idx) =>
      idx === currentPageIndex ? { ...page, panels: [...page.panels, newPanel] } : page
    );
    setPages(newPages);
    addToHistory(newPages);
    triggerVisualDirty();
  };

  const handlePanelUpdate = (updatedPanel: ComicPanel) => { 
    const newPages = pages.map((page, idx) =>
      idx === currentPageIndex
        ? { ...page, panels: page.panels.map(p => p.id === updatedPanel.id ? updatedPanel : p) }
        : page
    );
    setPages(newPages);
    triggerVisualDirty();
  };

  const handlePanelUpdateComplete = () => addToHistory(pages);

  const handlePanelSwap = (s: string, t: string) => { 
    const newPages = pages.map((page, idx) => {
      if (idx !== currentPageIndex) return page;
      const sIdx = page.panels.findIndex(p => p.id === s);
      const tIdx = page.panels.findIndex(p => p.id === t);
      if (sIdx === -1 || tIdx === -1) return page;
      const newPanels = [...page.panels];
      const sUrl = newPanels[sIdx].imageUrl;
      newPanels[sIdx] = { ...newPanels[sIdx], imageUrl: newPanels[tIdx].imageUrl };
      newPanels[tIdx] = { ...newPanels[tIdx], imageUrl: sUrl };
      return { ...page, panels: newPanels };
    });
    setPages(newPages);
    addToHistory(newPages);
    triggerVisualDirty();
  };

  const handleImageDrop = (id: string, url: string) => { 
    const newPages = pages.map((page, idx) =>
      idx === currentPageIndex
        ? { ...page, panels: page.panels.map(p => p.id === id ? { ...p, imageUrl: url } : p) }
        : page
    );
    setPages(newPages);
    addToHistory(newPages);
    triggerVisualDirty();
  };

  const handleBubbleAdd = (x: number, y: number, template?: Partial<SpeechBubble>) => { 
    const newBubble = { ...createDefaultBubble(x, y), ...template };
    const newPages = pages.map((page, idx) =>
      idx === currentPageIndex ? { ...page, bubbles: [...(page.bubbles || []), newBubble] } : page
    );
    setPages(newPages);
    addToHistory(newPages);
    setSelectedBubbleId(newBubble.id);
    setSelectedPanelId(null);
    setActiveTool('select');
    triggerVisualDirty();
  };

  const handleBubbleUpdate = (updatedBubble: SpeechBubble) => { 
    const newPages = pages.map((page, idx) =>
      idx === currentPageIndex
        ? { ...page, bubbles: (page.bubbles || []).map(b => b.id === updatedBubble.id ? updatedBubble : b) }
        : page
    );
    setPages(newPages);
    triggerVisualDirty();
  };

  const handleBubbleUpdateComplete = (updatedBubble: SpeechBubble) => { 
    handleBubbleUpdate(updatedBubble);
    addToHistory(pages);
  };

  const handleCanvasClick = () => { 
    setSelectedBubbleId(null); 
    setSelectedPanelId(null); 
    if (activeTool !== 'custom-panel') setActiveTool('select'); 
  };
  
  const getSelectedBubble = () => (currentPage.bubbles || []).find(b => b.id === selectedBubbleId) || null;
  const getSelectedPanel = () => currentPage.panels.find(p => p.id === selectedPanelId) || null;
  const hasNoImages = visualizations.length === 0 || visualizations.every(v => !v.imageUrl);

  if (isPagesLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (pagesError) return <div>Error: {pagesError}</div>;

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
          onFinish={handleFinish} 
          onSave={handleManualSave}
          onBack={onBack}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          zoom={zoom}
          isSaving={isSaving}
          isCustomPanelDisabled={currentPage.layout !== 'custom'}
        />

        {saveError && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex items-center gap-3 text-red-800">
             <Info className="w-5 h-5" /> Save Error: {saveError}
          </div>
        )}

        <div className="flex-1 flex overflow-hidden">
          <div className="w-72 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
            <div className="flex-[6] overflow-y-auto scrollbar-minimal border-b border-gray-200">
              <ImageGallery visualizations={visualizations} onImageUpload={handleImageUpload} />
            </div>
            <div className="flex-[4] overflow-y-hidden">
              <PagesSidebar
                pages={pages}
                currentPageIndex={currentPageIndex}
                onPageSelect={handlePageSelect}
                onPageAdd={handlePageAdd}
                onPageDelete={handlePageDelete}
                onPageReorder={projectId ? handlePageReorder : undefined}
                isLoading={isPagesLoading || isDeleting}
              />
            </div>
          </div>

          {hasNoImages ? (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
               <div className="text-center max-w-md px-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Scenes Available</h3>
                <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
                  <Upload className="w-5 h-5" /> Upload Images
                  <input type="file" accept="image/*" multiple onChange={(e) => handleImageUpload(e.target.files)} className="hidden" />
                </label>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <EditorCanvas
                page={currentPage}
                zoom={zoom}
                activeTool={activeTool}
                selectedBubbleId={selectedBubbleId}
                selectedPanelId={selectedPanelId}
                onBubbleSelect={handleBubbleSelect}
                onPanelSelect={handlePanelSelect}
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
            onPanelUpdate={(panel) => { handlePanelUpdate(panel); handlePanelUpdateComplete(); }}
            onLayoutChange={handleLayoutChange}
            currentLayout={currentPage.layout}
            onBubbleAdd={handleBubbleAdd}
            currentPagePanels={currentPage.panels}
            onDeselectBubble={() => setSelectedBubbleId(null)}
            onDeselectPanel={() => setSelectedPanelId(null)}
          />
        </div>

        <SaveModal 
          isOpen={isSaving || isAutoSaving || showSaveSuccess} 
          mode={isAutoSaving ? 'auto' : 'manual'} 
          isSuccess={showSaveSuccess} 
          error={saveError} 
        />
      </div>
    </DndProvider>
  );
};