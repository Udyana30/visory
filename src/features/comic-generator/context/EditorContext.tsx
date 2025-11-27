'use client';

import React, { createContext, useContext, useReducer, useMemo, useRef, useEffect } from 'react';
import { EditorState, ComicPage, ComicPanel, SpeechBubble, EditorTool } from '../types/domain/editor';
import { editorService } from '../services/editorService';
import { createEmptyPage, createDefaultBubble, createDefaultPanel } from '../utils/editorFactory';

type EditorAction =
  | { type: 'INIT_PAGES'; payload: ComicPage[] }
  | { type: 'SET_ACTIVE_PAGE'; payload: number }
  | { type: 'ADD_PAGE'; payload: ComicPage }
  | { type: 'DELETE_PAGE'; payload: number }
  | { type: 'UPDATE_PAGE_LAYOUT'; payload: { pageIndex: number, layout: ComicPage['layout'], newPanels: ComicPanel[] } }
  | { type: 'ADD_ELEMENT'; payload: ComicPanel | SpeechBubble }
  | { type: 'UPDATE_ELEMENT'; payload: { id: string; changes: Partial<ComicPanel | SpeechBubble> } }
  | { type: 'DELETE_ELEMENT'; payload: string }
  | { type: 'SELECT_ELEMENT'; payload: string | null }
  | { type: 'SET_TOOL'; payload: EditorTool }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'SET_AUTO_SAVING'; payload: boolean }
  | { type: 'MARK_CLEAN'; payload: number };

const initialState: EditorState = {
  pages: [],
  activePageIndex: 0,
  activeTool: 'select',
  selectedElementId: null,
  zoom: 1,
  history: { past: [], future: [] },
  isSaving: false,
  isAutoSaving: false,
  lastSaved: null
};

const editorReducer = (state: EditorState, action: EditorAction): EditorState => {
  switch (action.type) {
    case 'INIT_PAGES':
      return { ...state, pages: action.payload, history: { past: [], future: [] } };
    case 'SET_ACTIVE_PAGE':
      return { ...state, activePageIndex: action.payload, selectedElementId: null };
    case 'ADD_PAGE':
      return {
        ...state,
        pages: [...state.pages, action.payload],
        activePageIndex: state.pages.length,
        history: { past: [...state.history.past, state.pages], future: [] }
      };
    case 'DELETE_PAGE': {
      const newPages = state.pages.filter((_, idx) => idx !== action.payload);
      return {
        ...state,
        pages: newPages,
        activePageIndex: Math.max(0, state.activePageIndex - 1),
        history: { past: [...state.history.past, state.pages], future: [] }
      };
    }
    case 'UPDATE_PAGE_LAYOUT': {
      const newPages = state.pages.map((p, i) => 
        i === action.payload.pageIndex 
          ? { ...p, layout: action.payload.layout, elements: [...action.payload.newPanels, ...p.elements.filter(e => e.type === 'bubble')], isDirty: true } 
          : p
      );
      return { ...state, pages: newPages, history: { past: [...state.history.past, state.pages], future: [] } };
    }
    case 'SET_TOOL':
      return { ...state, activeTool: action.payload, selectedElementId: null };
    case 'SELECT_ELEMENT':
      return { ...state, selectedElementId: action.payload };
    case 'SET_ZOOM':
      return { ...state, zoom: action.payload };
    case 'ADD_ELEMENT': {
      const newPages = [...state.pages];
      const page = { ...newPages[state.activePageIndex] };
      page.elements = [...page.elements, action.payload];
      page.isDirty = true;
      newPages[state.activePageIndex] = page;
      return { ...state, pages: newPages, selectedElementId: action.payload.id, activeTool: 'select', history: { past: [...state.history.past, state.pages], future: [] } };
    }
    case 'UPDATE_ELEMENT': {
      const newPages = state.pages.map((page, idx) => {
        if (idx !== state.activePageIndex) return page;
        const elements = page.elements.map(el => {
          if (el.id !== action.payload.id) return el;
          if (el.type === 'bubble' && 'style' in action.payload.changes) {
             const changes = action.payload.changes as Partial<SpeechBubble>;
             return { ...el, ...changes, style: { ...(el as SpeechBubble).style, ...changes.style } };
          }
          return { ...el, ...action.payload.changes };
        });
        return { ...page, elements, isDirty: true };
      });
      return { ...state, pages: newPages as ComicPage[], history: { past: [...state.history.past, state.pages], future: [] } };
    }
    case 'DELETE_ELEMENT': {
      const newPages = state.pages.map((page, idx) => {
        if (idx !== state.activePageIndex) return page;
        return { ...page, elements: page.elements.filter(el => el.id !== action.payload), isDirty: true };
      });
      return { ...state, pages: newPages, selectedElementId: null, history: { past: [...state.history.past, state.pages], future: [] } };
    }
    case 'UNDO': {
      if (state.history.past.length === 0) return state;
      const previous = state.history.past[state.history.past.length - 1];
      return { ...state, pages: previous, history: { past: state.history.past.slice(0, -1), future: [state.pages, ...state.history.future] } };
    }
    case 'REDO': {
      if (state.history.future.length === 0) return state;
      const next = state.history.future[0];
      return { ...state, pages: next, history: { past: [...state.history.past, state.pages], future: state.history.future.slice(1) } };
    }
    case 'SET_SAVING': return { ...state, isSaving: action.payload };
    case 'SET_AUTO_SAVING': return { ...state, isAutoSaving: action.payload };
    case 'MARK_CLEAN': {
      const newPages = state.pages.map((p, i) => i === action.payload ? { ...p, isDirty: false } : p);
      return { ...state, pages: newPages, lastSaved: new Date() };
    }
    default: return state;
  }
};

interface EditorContextType {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  actions: {
    loadProject: (projectId: number) => Promise<void>;
    saveCurrentPage: (projectId: number) => Promise<void>;
    createPage: (projectId: number) => Promise<void>;
    deletePage: (projectId: number, pageIndex: number) => Promise<void>;
    addBubble: (x: number, y: number) => void;
    addCustomPanel: (x: number, y: number, w: number, h: number) => void;
  };
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  });

  const actions = useMemo(() => ({
    loadProject: async (projectId: number) => {
      try {
        const pages = await editorService.getPages(projectId);
        if (pages.length === 0) {
          dispatch({ type: 'INIT_PAGES', payload: [createEmptyPage(1)] });
        } else {
          dispatch({ type: 'INIT_PAGES', payload: pages });
        }
      } catch (error) {
        console.error(error);
      }
    },

    saveCurrentPage: async (projectId: number) => {
      const currentState = stateRef.current;
      const pageIndex = currentState.activePageIndex;
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

    createPage: async (projectId: number) => {
      const currentState = stateRef.current;
      dispatch({ type: 'SET_SAVING', payload: true });
      try {
        const newPage = await editorService.createPage(projectId, { page_number: currentState.pages.length + 1 });
        dispatch({ type: 'ADD_PAGE', payload: newPage });
      } catch (error) {
        dispatch({ type: 'ADD_PAGE', payload: createEmptyPage(currentState.pages.length + 1) });
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

    addBubble: (x: number, y: number) => {
      const currentState = stateRef.current;
      const currentElements = currentState.pages[currentState.activePageIndex].elements;
      const maxZ = currentElements.length > 0 ? Math.max(...currentElements.map(e => e.zIndex)) : 0;
      dispatch({ type: 'ADD_ELEMENT', payload: createDefaultBubble(x, y, maxZ + 1) });
    },

    addCustomPanel: (x: number, y: number, width: number, height: number) => {
      const currentState = stateRef.current;
      const currentElements = currentState.pages[currentState.activePageIndex].elements;
      const maxZ = currentElements.length > 0 ? Math.max(...currentElements.map(e => e.zIndex)) : 0;
      const panel = createDefaultPanel(maxZ + 1);
      panel.x = x; panel.y = y; panel.width = width; panel.height = height;
      panel.isCustom = true;
      dispatch({ type: 'ADD_ELEMENT', payload: panel });
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