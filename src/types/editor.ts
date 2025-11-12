export interface ComicPage {
    id: string;
    layout: 'single' | 'double' | 'triple' | 'quad' | 'custom';
    panels: ComicPanel[];
    backgroundColor: string;
  }
  
  export interface ComicPanel {
    id: string;
    imageUrl: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    bubbles: SpeechBubble[];
    imagePosition?: {
      x: number;
      y: number;
    };
    imageScale?: number;
    isCustom?: boolean;
  }
  
  export interface SpeechBubble {
    id: string;
    type: 'speech' | 'thought' | 'narration' | 'shout' | 'whisper';
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
    fontFamily: string;
    textAlign: 'left' | 'center' | 'right';
    color: string;
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }
  
  export interface SceneVisualization {
    id: string;
    sceneId: string;
    prompt: string;
    aspectRatio: string;
    shotType: string;
    shotSize: string;
    shotAngle: string;
    lighting: string;
    mood: string;
    composition: string;
    characters: string[];
    imageUrl?: string;
  }
  
  export interface DraggedImage {
    imageUrl: string;
    visualizationId: string;
  }
  
  export interface DraggedPanel {
    panelId: string;
    imageUrl: string;
  }
  
  export type EditorTool = 'select' | 'bubble' | 'text' | 'image' | 'layout' | 'custom-panel';
  
  export interface BubbleTemplate {
    id: string;
    name: string;
    icon: string;
    preview: string;
    style: Partial<SpeechBubble>;
  }
  
  export interface EditorHistory {
    pages: ComicPage[];
    currentPageIndex: number;
  }
  
  export interface PanelDefinition {
    x: number;
    y: number;
    width: number;
    height: number;
  }
  
  export interface CustomPanelDrawing {
    startX: number;
    startY: number;
    width: number;
    height: number;
  }