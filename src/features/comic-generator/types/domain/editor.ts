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
  lastSaved: Date | null;
}