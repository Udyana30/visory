import React, { useEffect, useRef, useState } from 'react';
import { sceneService } from '@/features/comic-generator/services/sceneService';
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

  const [customScenes, setCustomScenes] = useState<SceneVisualization[]>([]);
  const [uploadingScenes, setUploadingScenes] = useState<Set<string>>(new Set());

  const handleUpload = async (files: FileList | null) => {
    if (!files || !projectId) {
      console.warn('No files or projectId provided');
      return;
    }

    console.log(`Starting upload of ${files.length} file(s) to project ${projectId}`);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const tempId = `uploading_${Date.now()}_${i}`;

        // Create temporary scene with loading state
        const tempScene: SceneVisualization = {
          id: tempId,
          prompt: 'Custom Scene',
          aspectRatio: '1:1',
          shotType: 'auto',
          shotSize: 'auto',
          shotAngle: 'auto',
          lighting: 'auto',
          mood: 'auto',
          composition: 'auto',
          characters: [],
          imageUrl: URL.createObjectURL(file), // Preview image
          negativePrompt: ''
        };

        // Add to custom scenes and mark as uploading
        setCustomScenes(prev => [...prev, tempScene]);
        setUploadingScenes(prev => new Set(prev).add(tempId));

        try {
          console.log(`Uploading file: ${file.name}, size: ${file.size} bytes`);
          const response = await sceneService.uploadCustomScene(projectId, file);
          console.log('Upload successful:', response);

          // Replace temp scene with actual response
          setCustomScenes(prev => prev.map(scene =>
            scene.id === tempId ? {
              id: response.id.toString(),
              prompt: response.prompt,
              aspectRatio: response.aspect_ratio,
              shotType: response.shot_type,
              shotSize: response.shot_size,
              shotAngle: response.shot_angle,
              lighting: response.lighting,
              mood: response.mood,
              composition: response.composition,
              characters: response.character_ids ? response.character_ids.map(String) : [],
              imageUrl: response.image_url,
              negativePrompt: response.negative_prompt
            } : scene
          ));
        } catch (uploadError: any) {
          console.error('Upload failed for file:', file.name, uploadError);
          // Remove failed upload
          setCustomScenes(prev => prev.filter(scene => scene.id !== tempId));
          alert(`Failed to upload ${file.name}: ${uploadError.message || 'Unknown error'}`);
        } finally {
          // Remove from uploading set
          setUploadingScenes(prev => {
            const next = new Set(prev);
            next.delete(tempId);
            return next;
          });
          // Clean up object URL
          URL.revokeObjectURL(tempScene.imageUrl!);
        }
      }
    } catch (error: any) {
      console.error('Upload process failed:', error);
      alert(`Upload failed: ${error.message || 'Unknown error'}`);
    }
  };

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
            visualizations={[...visualizations, ...customScenes]}
            projectId={projectId}
            onUpload={handleUpload}
            uploadingIds={uploadingScenes}
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