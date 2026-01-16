import React, { useEffect, useRef } from 'react';
import { useEditorActions } from '@/features/comic-generator/hooks/editor/useEditorActions';
import { useAutoSave } from '@/features/comic-generator/hooks/editor/useAutoSave';
import { useEditorShortcuts } from '@/features/comic-generator/hooks/editor/useEditorShortcuts';
import { useEditor } from '@/features/comic-generator/context/EditorContext';
import { DndProvider } from '@/features/comic-generator/components/editor/DndProvider';
import { EditorToolbar } from '@/features/comic-generator/components/editor/toolbar/EditorToolbar';
import { EditorSidebar } from '@/features/comic-generator/components/editor/sidebar/EditorSidebar';
import { EditorCanvas } from '@/features/comic-generator/components/editor/canvas/EditorCanvas';
import { PropertiesPanel } from '@/features/comic-generator/components/editor/properties/PropertiesPanel';
import { SaveFeedback } from '@/features/comic-generator/components/editor/feedback/SaveFeedback';
import { useUnsavedChanges } from '@/features/comic-generator/hooks/editor/useUnsavedChanges';
import { SceneVisualization } from '../types/domain/scene';

interface ComicEditorProps {
  visualizations: SceneVisualization[];
  projectId: number | null;
  projectName?: string;
  onBack: () => void;
  onNext: () => void;
  onPageModified: (pageId: number) => void;
}

const ComicEditorContent: React.FC<ComicEditorProps> = ({
  visualizations,
  projectId,
  onBack,
  onNext,
  onPageModified
}) => {
  const {
    loadProject,
    manualSavePage,
    saveAllChanges,
    isSaving,
    isAutoSaving,
    isSaveSuccess,
    suppressFeedback,
    pages,
    activePageIndex,
    setZoom,
    resetState
  } = useEditorActions();

  const { state } = useEditor();
  const isDirty = state.pages.some(p => p.isDirty);

  const isLoadedRef = useRef(false);
  const currentProjectIdRef = useRef<number | null>(null);

  const { handleInterceptNavigation, isSavingAndExiting } = useUnsavedChanges(
    isDirty,
    () => (projectId ? saveAllChanges(projectId) : Promise.resolve())
  );

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId, loadProject]);

  useEffect(() => {
    return () => {
      // No-op for now to persist state
    };
  }, []);

  useEffect(() => {
    const currentPage = pages[activePageIndex];
    if (currentPage?.isDirty && currentPage.id && !isNaN(Number(currentPage.id))) {
      onPageModified(Number(currentPage.id));
    }
  }, [pages, activePageIndex, onPageModified]);

  useAutoSave(projectId);
  useEditorShortcuts(projectId);

  const handleFinish = async () => {
    if (projectId) {
      await saveAllChanges(projectId);
    }
    onNext();
  };

  const handleSafeBack = () => {
    handleInterceptNavigation(onBack);
  };

  const shouldShowFeedback = (isSaving || isAutoSaving || isSavingAndExiting || isSaveSuccess) && !suppressFeedback;

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="shrink-0 bg-white z-20">
        <EditorToolbar
          onBack={handleSafeBack}
          onFinish={handleFinish}
          projectId={projectId}
        />
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="shrink-0 w-72 border-r border-gray-200 bg-white z-10 h-full flex flex-col">
          <EditorSidebar
            visualizations={visualizations}
            projectId={projectId}
          />
        </div>

        <div className="flex-1 min-w-0 relative bg-gray-100 h-full">
          <EditorCanvas />
        </div>

        <div className="shrink-0 w-80 border-l border-gray-200 bg-white z-10 h-full flex flex-col">
          <PropertiesPanel />
        </div>
      </div>

      <SaveFeedback
        isOpen={shouldShowFeedback}
        mode={isAutoSaving ? 'auto' : 'manual'}
        isSuccess={isSaveSuccess}
        customMessage={isSavingAndExiting ? "Saving all changes..." : undefined}
      />
    </div>
  );
};

export const ComicEditor: React.FC<ComicEditorProps> = (props) => {
  return (
    <DndProvider>
      <ComicEditorContent {...props} />
    </DndProvider>
  );
};