export type EditorTool = 'select' | 'hand' | 'bubble' | 'text' | 'image' | 'layout' | 'custom-panel';
export type BubbleType = 'speech' | 'thought' | 'narration' | 'shout' | 'whisper';
export type TextAlignment = 'left' | 'center' | 'right';
export type PageLayout = 'single' | 'double' | 'triple' | 'quad' | 'custom';

export interface EditorElement {
  id: string;
  type: 'panel' | 'bubble';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  isSelected?: boolean;
}

export interface ComicPanel extends EditorElement {
  type: 'panel';
  imageUrl?: string;
  imageScale?: number;
  imagePosition?: { x: number; y: number };
  isCustom?: boolean;
}

export interface BubbleStyle {
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  textAlign: TextAlignment;
  color: string;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  showTail: boolean;
  type?: BubbleType;
  variant?: BubbleType; 
}

export interface SpeechBubble extends EditorElement {
  type: 'bubble';
  variant: BubbleType;
  text: string;
  style: BubbleStyle;
}

export interface BubbleTemplate {
  id: string;
  name: string;
  icon: string;
  preview: string;
  style: Partial<BubbleStyle> & { type: BubbleType };
}

export interface ComicPage {
  id: string;
  pageNumber: number;
  layout: PageLayout;
  elements: (ComicPanel | SpeechBubble)[];
  backgroundColor: string;
  previewUrl?: string;
  isDirty?: boolean;
}

export interface EditorState {
  pages: ComicPage[];
  activePageIndex: number;
  activeTool: EditorTool;
  selectedElementId: string | null;
  zoom: number;
  history: {
    past: ComicPage[][];
    future: ComicPage[][];
  };
  isSaving: boolean;
  isAutoSaving: boolean;
  isSaveSuccess: boolean;
  suppressFeedback: boolean;
  lastSaved: Date | null;
  touchedPageIds: Set<string>;
}

export type EditorAction =
  | { type: 'INIT_PAGES'; payload: ComicPage[] }
  | { type: 'SET_ACTIVE_PAGE'; payload: number }
  | { type: 'ADD_PAGE'; payload: ComicPage }
  | { type: 'DELETE_PAGE'; payload: number }
  | { type: 'REORDER_PAGES'; payload: { oldIndex: number; newIndex: number } }
  | { type: 'UPDATE_PAGE_LAYOUT'; payload: { pageIndex: number, layout: PageLayout, newPanels: ComicPanel[] } }
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
  | { type: 'SET_SAVE_SUCCESS'; payload: boolean }
  | { type: 'SET_SUPPRESS_FEEDBACK'; payload: boolean }
  | { type: 'MARK_CLEAN'; payload: number }
  | { type: 'MARK_PREVIEWS_GENERATED' };