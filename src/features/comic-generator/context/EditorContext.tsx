import React, { createContext, useContext, useReducer, useMemo, useRef, useEffect } from 'react';
import { EditorState, ComicPage, ComicPanel, SpeechBubble, EditorTool, PageLayout, BubbleType, BubbleStyle, EditorAction } from '../types/domain/editor';
import { editorService } from '../services/editorService';
import { createInitialPage, createDefaultBubble, createDefaultPanel, generatePanelsFromLayout } from '../utils/editorFactory';
import { DEFAULT_BUBBLE_STYLE } from '../constants/editor';

const initialState: EditorState = {
  pages: [],
  activePageIndex: 0,
  activeTool: 'select',
  selectedElementId: null,
  zoom: 1,
  history: { past: [], future: [] },
  isSaving: false,
  isAutoSaving: false,
  isSaveSuccess: false,
  suppressFeedback: false,
  lastSaved: null,
  touchedPageIds: new Set()
};

const editorReducer = (state: EditorState, action: EditorAction | { type: 'UPDATE_PAGE_PREVIEWS', payload: Record<string, string> }): EditorState => {
  switch (action.type) {
    case 'INIT_PAGES':
      return { ...state, pages: action.payload, history: { past: [], future: [] }, touchedPageIds: new Set() };
      
    case 'SET_ACTIVE_PAGE':
      return { ...state, activePageIndex: action.payload, selectedElementId: null };
      
    case 'ADD_PAGE': {
      const newPage = action.payload;
      const newTouched = new Set(state.touchedPageIds);
      newTouched.add(newPage.id);
      
      return {
        ...state,
        pages: [...state.pages, newPage],
        activePageIndex: state.pages.length,
        history: { past: [...state.history.past, state.pages], future: [] },
        touchedPageIds: newTouched
      };
    }

    case 'DELETE_PAGE': {
      const pageIndex = action.payload;
      const pageToDelete = state.pages[pageIndex];
      const newPages = state.pages.filter((_, idx) => idx !== pageIndex);
      
      const reindexedPages = newPages.map((page, index) => ({ 
        ...page, 
        pageNumber: index + 1 
      }));

      const newTouched = new Set(state.touchedPageIds);
      if (pageToDelete) newTouched.delete(pageToDelete.id);
      
      reindexedPages.forEach(page => newTouched.add(page.id));

      return {
        ...state,
        pages: reindexedPages,
        activePageIndex: Math.max(0, Math.min(state.activePageIndex, reindexedPages.length - 1)),
        history: { past: [...state.history.past, state.pages], future: [] },
        touchedPageIds: newTouched
      };
    }

    case 'REORDER_PAGES': {
      const { oldIndex, newIndex } = action.payload;
      const newPages = [...state.pages];
      const [movedPage] = newPages.splice(oldIndex, 1);
      newPages.splice(newIndex, 0, movedPage);
      const reindexedPages = newPages.map((page, index) => ({ ...page, pageNumber: index + 1 }));
      
      let newActiveIndex = state.activePageIndex;
      if (state.activePageIndex === oldIndex) newActiveIndex = newIndex;
      else if (state.activePageIndex > oldIndex && state.activePageIndex <= newIndex) newActiveIndex -= 1;
      else if (state.activePageIndex < oldIndex && state.activePageIndex >= newIndex) newActiveIndex += 1;
      
      const newTouched = new Set(state.touchedPageIds);
      reindexedPages.forEach(p => newTouched.add(p.id));

      return { 
        ...state, 
        pages: reindexedPages, 
        activePageIndex: newActiveIndex, 
        history: { past: [...state.history.past, state.pages], future: [] }, 
        touchedPageIds: newTouched 
      };
    }

    case 'UPDATE_PAGE_LAYOUT': {
      const newPages = state.pages.map((p, i) => {
        if (i !== action.payload.pageIndex) return p;
        const bubbles = p.elements.filter(e => e.type === 'bubble');
        const newElements = [...action.payload.newPanels, ...bubbles];
        return { ...p, layout: action.payload.layout, elements: newElements, isDirty: true };
      });
      
      const newTouched = new Set(state.touchedPageIds);
      newTouched.add(state.pages[action.payload.pageIndex].id);
      
      return { 
        ...state, 
        pages: newPages, 
        history: { past: [...state.history.past, state.pages], future: [] }, 
        touchedPageIds: newTouched 
      };
    }

    case 'ADD_ELEMENT': {
      const newPages = [...state.pages];
      const page = { ...newPages[state.activePageIndex] };
      const isPanel = action.payload.type === 'panel';
      if (isPanel) page.layout = 'custom';
      page.elements = [...page.elements, action.payload];
      page.isDirty = true;
      newPages[state.activePageIndex] = page;
      
      const newTouched = new Set(state.touchedPageIds);
      newTouched.add(page.id);

      return { 
        ...state, 
        pages: newPages, 
        selectedElementId: action.payload.id, 
        activeTool: 'select', 
        history: { past: [...state.history.past, state.pages], future: [] }, 
        touchedPageIds: newTouched 
      };
    }

    case 'UPDATE_ELEMENT': {
      const newPages = state.pages.map((page, idx) => {
        if (idx !== state.activePageIndex) return page;
        let shouldForceCustom = false;
        const elements = page.elements.map(el => {
          if (el.id !== action.payload.id) return el;
          if (el.type === 'panel') {
            const changes = action.payload.changes as Partial<ComicPanel>;
            const isGeometryChange = changes.x !== undefined || changes.y !== undefined || changes.width !== undefined || changes.height !== undefined;
            if (isGeometryChange) shouldForceCustom = true;
          }
          if (el.type === 'bubble' && 'style' in action.payload.changes) {
             const changes = action.payload.changes as Partial<SpeechBubble>;
             return { ...el, ...changes, style: { ...(el as SpeechBubble).style, ...changes.style } };
          }
          return { ...el, ...action.payload.changes };
        });
        return { ...page, elements, layout: shouldForceCustom ? 'custom' : page.layout, isDirty: true };
      });
      
      const newTouched = new Set(state.touchedPageIds);
      newTouched.add(state.pages[state.activePageIndex].id);

      return { 
        ...state, 
        pages: newPages as ComicPage[], 
        history: { past: [...state.history.past, state.pages], future: [] }, 
        touchedPageIds: newTouched 
      };
    }

    case 'DELETE_ELEMENT': {
      const newPages = state.pages.map((page, idx) => {
        if (idx !== state.activePageIndex) return page;
        const elementToDelete = page.elements.find(el => el.id === action.payload);
        const isPanel = elementToDelete?.type === 'panel';
        return { 
          ...page, 
          elements: page.elements.filter(el => el.id !== action.payload), 
          layout: isPanel ? 'custom' : page.layout, 
          isDirty: true 
        };
      });

      const newTouched = new Set(state.touchedPageIds);
      newTouched.add(state.pages[state.activePageIndex].id);

      return { 
        ...state, 
        pages: newPages, 
        selectedElementId: null, 
        history: { past: [...state.history.past, state.pages], future: [] }, 
        touchedPageIds: newTouched 
      };
    }

    case 'MARK_PREVIEWS_GENERATED': {
      return { ...state, touchedPageIds: new Set() };
    }

    case 'UPDATE_PAGE_PREVIEWS': {
      const newPages = state.pages.map(p => {
        if (action.payload[p.id]) {
          return { ...p, previewUrl: action.payload[p.id] };
        }
        return p;
      });
      return { ...state, pages: newPages };
    }

    case 'MARK_CLEAN': {
      const newPages = state.pages.map((p, i) => i === action.payload ? { ...p, isDirty: false } : p);
      return { ...state, pages: newPages, lastSaved: new Date() };
    }

    case 'SET_TOOL': return { ...state, activeTool: action.payload, selectedElementId: null };
    case 'SELECT_ELEMENT': return { ...state, selectedElementId: action.payload };
    case 'SET_ZOOM': return { ...state, zoom: action.payload };
    
    case 'UNDO': {
        if (state.history.past.length === 0) return state;
        const previous = state.history.past[state.history.past.length - 1];
        const newTouched = new Set(state.touchedPageIds); 
        previous.forEach(p => newTouched.add(p.id)); 
        return { 
          ...state, 
          pages: previous, 
          history: { past: state.history.past.slice(0, -1), future: [state.pages, ...state.history.future] }, 
          touchedPageIds: newTouched 
        };
    }
    
    case 'REDO': {
        if (state.history.future.length === 0) return state;
        const next = state.history.future[0];
        const newTouched = new Set(state.touchedPageIds); 
        next.forEach(p => newTouched.add(p.id));
        return { 
          ...state, 
          pages: next, 
          history: { past: [...state.history.past, state.pages], future: state.history.future.slice(1) }, 
          touchedPageIds: newTouched 
        };
    }
    
    case 'SET_SAVING': return { ...state, isSaving: action.payload };
    case 'SET_AUTO_SAVING': return { ...state, isAutoSaving: action.payload };
    case 'SET_SAVE_SUCCESS': return { ...state, isSaveSuccess: action.payload };
    case 'SET_SUPPRESS_FEEDBACK': return { ...state, suppressFeedback: action.payload };

    default: return state;
  }
};

interface EditorContextType {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction | { type: 'UPDATE_PAGE_PREVIEWS', payload: Record<string, string> }>;
  actions: {
    loadProject: (projectId: number) => Promise<void>;
    manualSavePage: (projectId: number, options?: { silent?: boolean }) => Promise<void>;
    autoSavePage: (projectId: number, targetPageIndex?: number) => Promise<void>;
    saveAllChanges: (projectId: number) => Promise<void>;
    createPage: (projectId: number) => Promise<void>;
    deletePage: (projectId: number, pageIndex: number) => Promise<void>;
    reorderPages: (oldIndex: number, newIndex: number) => void;
    savePageOrder: (projectId: number) => Promise<void>;
    addBubble: (x: number, y: number, variant?: BubbleType, styleOverride?: Partial<BubbleStyle>) => void;
    addCustomPanel: (x: number, y: number, width: number, height: number) => void;
    updatePageLayout: (layout: PageLayout) => void;
    markPreviewsGenerated: () => void;
    updatePagePreviews: (previews: Record<string, string>) => void;
  };
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);
  const stateRef = useRef(state);

  useEffect(() => { stateRef.current = state; });

  const actions = useMemo(() => ({
    loadProject: async (projectId: number) => {
      try {
        const pages = await editorService.getPages(projectId);
        if (pages.length === 0) {
          dispatch({ type: 'INIT_PAGES', payload: [createInitialPage(1)] });
        } else {
          dispatch({ type: 'INIT_PAGES', payload: pages });
        }
      } catch (error) {
        dispatch({ type: 'INIT_PAGES', payload: [createInitialPage(1)] });
      }
    },

    manualSavePage: async (projectId: number, options?: { silent?: boolean }) => {
      const currentState = stateRef.current;
      const pageIndex = currentState.activePageIndex;
      const page = currentState.pages[pageIndex];
      if (!page) return;

      if (options?.silent) dispatch({ type: 'SET_SUPPRESS_FEEDBACK', payload: true });
      dispatch({ type: 'SET_SAVING', payload: true });
      dispatch({ type: 'SET_SAVE_SUCCESS', payload: false });

      try {
        const minLoadingTime = new Promise(resolve => setTimeout(resolve, 500));
        await Promise.all([
          editorService.savePage(projectId, page),
          !options?.silent ? minLoadingTime : Promise.resolve()
        ]);

        dispatch({ type: 'MARK_CLEAN', payload: pageIndex });
        dispatch({ type: 'SET_SAVING', payload: false });
        
        if (!options?.silent) {
          dispatch({ type: 'SET_SAVE_SUCCESS', payload: true });
          setTimeout(() => dispatch({ type: 'SET_SAVE_SUCCESS', payload: false }), 1500);
        } else {
          dispatch({ type: 'SET_SUPPRESS_FEEDBACK', payload: false });
        }
      } catch (error) {
        dispatch({ type: 'SET_SAVING', payload: false });
        if (options?.silent) dispatch({ type: 'SET_SUPPRESS_FEEDBACK', payload: false });
      }
    },

    autoSavePage: async (projectId: number, targetPageIndex?: number) => {
      const currentState = stateRef.current;
      const pageIndex = targetPageIndex ?? currentState.activePageIndex;
      const page = currentState.pages[pageIndex];
      if (!page || !page.isDirty) return;

      dispatch({ type: 'SET_AUTO_SAVING', payload: true });
      try {
        await editorService.savePage(projectId, page);
        dispatch({ type: 'MARK_CLEAN', payload: pageIndex });
      } catch (error) {
        console.error(error);
      } finally {
        dispatch({ type: 'SET_AUTO_SAVING', payload: false });
      }
    },

    saveAllChanges: async (projectId: number) => {
      const currentState = stateRef.current;
      const dirtyPages = currentState.pages.filter(p => p.isDirty);
      
      dispatch({ type: 'SET_SAVING', payload: true });

      try {
        const promises: Promise<any>[] = [];
        if (dirtyPages.length > 0) {
          const saveContentPromises = dirtyPages.map(async (page) => {
            await editorService.savePage(projectId, page);
            const index = currentState.pages.findIndex(p => p.id === page.id);
            if (index !== -1) dispatch({ type: 'MARK_CLEAN', payload: index });
          });
          promises.push(...saveContentPromises);
        }
        promises.push(editorService.updatePageOrder(projectId, currentState.pages));
        await Promise.all(promises);
        
        dispatch({ type: 'SET_SAVE_SUCCESS', payload: true });
        setTimeout(() => dispatch({ type: 'SET_SAVE_SUCCESS', payload: false }), 1500);
      } catch (error) {
        console.error(error);
      } finally {
        dispatch({ type: 'SET_SAVING', payload: false });
      }
    },

    updatePagePreviews: (previews: Record<string, string>) => {
      dispatch({ type: 'UPDATE_PAGE_PREVIEWS', payload: previews });
    },

    createPage: async (projectId: number) => {
      const currentState = stateRef.current;
      dispatch({ type: 'SET_SAVING', payload: true });
      try {
        const nextPageNum = currentState.pages.length + 1;
        const apiPage = await editorService.createPage(projectId, { page_number: nextPageNum });
        let newPage: ComicPage = apiPage;
        if (!apiPage.elements || apiPage.elements.length === 0) {
           newPage = { ...apiPage, layout: 'single', elements: generatePanelsFromLayout('single') };
        }
        dispatch({ type: 'ADD_PAGE', payload: newPage });
      } catch (error) {
        dispatch({ type: 'ADD_PAGE', payload: createInitialPage(currentState.pages.length + 1) });
      } finally {
        dispatch({ type: 'SET_SAVING', payload: false });
      }
    },

    deletePage: async (projectId: number, pageIndex: number) => {
      const currentState = stateRef.current;
      const page = currentState.pages[pageIndex];
      if (!page) return;
      
      dispatch({ type: 'SET_SAVING', payload: true });
      try {
        if (!isNaN(Number(page.id))) await editorService.deletePage(projectId, page.id);
        dispatch({ type: 'DELETE_PAGE', payload: pageIndex });
      } catch (error) {
        console.error(error);
      } finally {
        dispatch({ type: 'SET_SAVING', payload: false });
      }
    },

    reorderPages: (oldIndex: number, newIndex: number) => {
      dispatch({ type: 'REORDER_PAGES', payload: { oldIndex, newIndex } });
    },

    savePageOrder: async (projectId: number) => {
      if (!projectId || isNaN(projectId)) return;
      const currentState = stateRef.current;
      try {
        await editorService.updatePageOrder(projectId, currentState.pages);
      } catch (error) {
        console.error(error);
      }
    },

    addBubble: (x: number, y: number, variant: BubbleType = 'speech', styleOverride: Partial<BubbleStyle> = {}) => {
      const currentState = stateRef.current;
      const currentElements = currentState.pages[currentState.activePageIndex].elements;
      const maxZ = currentElements.length > 0 ? Math.max(...currentElements.map(e => e.zIndex)) : 0;
      const newBubble = createDefaultBubble(x, y, maxZ + 1);
      newBubble.variant = variant;
      newBubble.style = { ...DEFAULT_BUBBLE_STYLE, ...styleOverride };
      dispatch({ type: 'ADD_ELEMENT', payload: newBubble });
    },

    addCustomPanel: (x: number, y: number, width: number, height: number) => {
      const currentState = stateRef.current;
      const currentElements = currentState.pages[currentState.activePageIndex].elements;
      const maxZ = currentElements.length > 0 ? Math.max(...currentElements.map(e => e.zIndex)) : 0;
      const panel = createDefaultPanel(maxZ + 1);
      panel.x = x; panel.y = y; panel.width = width; panel.height = height;
      panel.isCustom = true;
      dispatch({ type: 'ADD_ELEMENT', payload: panel });
    },

    updatePageLayout: (layout: PageLayout) => {
      const currentState = stateRef.current;
      const pageIndex = currentState.activePageIndex;
      if (layout === 'custom') {
        dispatch({ type: 'UPDATE_PAGE_LAYOUT', payload: { pageIndex, layout: 'custom', newPanels: [] } });
        dispatch({ type: 'SET_TOOL', payload: 'custom-panel' });
        return;
      }
      const newPanels = generatePanelsFromLayout(layout);
      dispatch({ type: 'UPDATE_PAGE_LAYOUT', payload: { pageIndex, layout, newPanels } });
      dispatch({ type: 'SET_TOOL', payload: 'select' });
    },

    markPreviewsGenerated: () => {
      dispatch({ type: 'MARK_PREVIEWS_GENERATED' });
    }
  }), []);

  return (
    <EditorContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) throw new Error('useEditor must be used within EditorProvider');
  return context;
};