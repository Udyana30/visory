import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { DndProvider } from '../components/editor/DndProvider';
import { EditorToolbar } from '../components/editor/EditorToolbar';
import { EditorCanvas } from '../components/editor/EditorCanvas';
import { PropertiesPanel } from '../components/editor/PropertiesPanel';
import { ImageGallery } from '../components/editor/ImageGallery';
import { PagesSidebar } from '../components/editor/PagesSidebar';
import { SaveModal } from '../components/editor/SaveModal';
import { ComicPage, SpeechBubble, SceneVisualization } from '@/types/editor';
import { 
  createEmptyPage, 
  createPanelsFromLayout, 
  clonePages, 
  findBubbleInPage,
  createDefaultBubble 
} from '@/lib/editorUtils';

interface ComicEditorProps {
  visualizations: SceneVisualization[];
  onBack: () => void;
  onNext: () => void;
}

export const ComicEditor: React.FC<ComicEditorProps> = ({
  visualizations,
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
        id: `page-${index}`,
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
  const [activeTool, setActiveTool] = useState<'select' | 'bubble' | 'text' | 'image' | 'layout'>('select');
  const [selectedBubbleId, setSelectedBubbleId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(0.8);
  const [history, setHistory] = useState<ComicPage[][]>([clonePages(pages)]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const currentPage = pages[currentPageIndex] || createEmptyPage();

  const addToHistory = (newPages: ComicPage[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(clonePages(newPages));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handlePageAdd = () => {
    const newPages = [...pages, createEmptyPage()];
    setPages(newPages);
    addToHistory(newPages);
    setCurrentPageIndex(newPages.length - 1);
  };

  const handlePageDelete = (index: number) => {
    if (pages.length === 1) return;
    const newPages = pages.filter((_, i) => i !== index);
    setPages(newPages);
    addToHistory(newPages);
    if (currentPageIndex >= newPages.length) {
      setCurrentPageIndex(newPages.length - 1);
    }
  };

  const handleLayoutChange = (layout: string) => {
    const newPanels = createPanelsFromLayout(layout, currentPage.panels);
    const newPages = pages.map((page, idx) =>
      idx === currentPageIndex
        ? { ...page, layout: layout as any, panels: newPanels }
        : page
    );
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
    if (!selectedBubbleId) return;

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
    console.log('Export comic:', pages);
    alert('Export functionality will be implemented with html2canvas');
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Saved pages:', pages);
    setIsSaving(false);
  };

  const handleCanvasClick = () => {
    setSelectedBubbleId(null);
    setActiveTool('select');
  };

  const getSelectedBubble = (): SpeechBubble | null => {
    if (!selectedBubbleId) return null;
    const result = findBubbleInPage(currentPage, selectedBubbleId);
    return result ? result.bubble : null;
  };

  const hasNoImages = visualizations.length === 0 || visualizations.every(v => !v.imageUrl);

  return (
    <DndProvider>
      <div className="h-screen flex flex-col bg-gray-50">
        <EditorToolbar
          activeTool={activeTool}
          onToolChange={setActiveTool}
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
        />

        <div className="flex-1 flex overflow-hidden">
          <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
            <ImageGallery 
              visualizations={visualizations}
              onImageUpload={handleImageUpload}
            />
            <PagesSidebar
              pages={pages}
              currentPageIndex={currentPageIndex}
              onPageSelect={setCurrentPageIndex}
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
            <EditorCanvas
              page={currentPage}
              zoom={zoom}
              activeTool={activeTool}
              selectedBubbleId={selectedBubbleId}
              onBubbleSelect={setSelectedBubbleId}
              onBubbleUpdate={handleBubbleUpdate}
              onBubbleAdd={handleBubbleAdd}
              onImageDrop={handleImageDrop}
              onCanvasClick={handleCanvasClick}
            />
          )}

          <PropertiesPanel
            selectedBubble={getSelectedBubble()}
            onBubbleUpdate={handleBubbleUpdateComplete}
            onLayoutChange={handleLayoutChange}
            currentLayout={currentPage.layout}
            onBubbleAdd={handleBubbleAdd}
            currentPagePanels={currentPage.panels}
            onDeselectBubble={() => setSelectedBubbleId(null)}
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
      </div>
    </DndProvider>
  );
};