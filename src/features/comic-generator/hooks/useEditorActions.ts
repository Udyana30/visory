import { useCallback, useMemo } from 'react';
import { useEditor } from '../context/EditorContext';
import { EditorTool, ComicPanel, SpeechBubble } from '../types/domain/editor';

export const useEditorActions = () => {
  const { state, dispatch, actions } = useEditor();

  const setTool = useCallback((tool: EditorTool) => {
    dispatch({ type: 'SET_TOOL', payload: tool });
  }, [dispatch]);

  const setZoom = useCallback((zoom: number) => {
    const clampedZoom = Math.max(0.1, Math.min(3, zoom));
    dispatch({ type: 'SET_ZOOM', payload: clampedZoom });
  }, [dispatch]);

  const zoomIn = useCallback(() => {
    const currentZoom = state.zoom; 
    const clampedZoom = Math.max(0.1, Math.min(3, currentZoom + 0.1));
    dispatch({ type: 'SET_ZOOM', payload: clampedZoom });
  }, [state.zoom, dispatch]);

  const zoomOut = useCallback(() => {
    const currentZoom = state.zoom;
    const clampedZoom = Math.max(0.1, Math.min(3, currentZoom - 0.1));
    dispatch({ type: 'SET_ZOOM', payload: clampedZoom });
  }, [state.zoom, dispatch]);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, [dispatch]);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, [dispatch]);

  const deleteSelected = useCallback(() => {
    if (state.selectedElementId) {
      dispatch({ type: 'DELETE_ELEMENT', payload: state.selectedElementId });
    }
  }, [state.selectedElementId, dispatch]);

  const updateElement = useCallback((id: string, changes: Partial<ComicPanel | SpeechBubble>) => {
    dispatch({ type: 'UPDATE_ELEMENT', payload: { id, changes } });
  }, [dispatch]);

  const selectElement = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_ELEMENT', payload: id });
  }, [dispatch]);

  const setActivePage = useCallback((index: number) => {
    dispatch({ type: 'SET_ACTIVE_PAGE', payload: index });
  }, [dispatch]);

  return useMemo(() => ({
    activeTool: state.activeTool,
    zoom: state.zoom,
    activePageIndex: state.activePageIndex,
    pages: state.pages,
    canUndo: state.history.past.length > 0,
    canRedo: state.history.future.length > 0,
    isSaving: state.isSaving,
    isAutoSaving: state.isAutoSaving,
    selectedElementId: state.selectedElementId,
    
    setTool,
    setZoom,
    zoomIn,
    zoomOut,
    undo,
    redo,
    deleteSelected,
    updateElement,
    selectElement,
    setActivePage,
    
    saveCurrentPage: actions.saveCurrentPage,
    loadProject: actions.loadProject,
    createPage: actions.createPage,
    deletePage: actions.deletePage,
    addBubble: actions.addBubble,
    addCustomPanel: actions.addCustomPanel
  }), [
    state.activeTool,
    state.zoom,
    state.activePageIndex,
    state.pages,
    state.history.past.length,
    state.history.future.length,
    state.isSaving,
    state.isAutoSaving,
    state.selectedElementId,
    setTool,
    setZoom,
    zoomIn,
    zoomOut,
    undo,
    redo,
    deleteSelected,
    updateElement,
    selectElement,
    setActivePage,
    actions
  ]);
};