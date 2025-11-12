export interface Project {
  id: string;
  name: string;
  genre: string;
  artStyle: string;
  pageSize: string;
  createdAt: Date;
  thumbnail?: string;
}

export interface OnboardingStep {
  icon: any;
  title: string;
  description: string;
  image: string;
}

export interface ArtStyle {
  id: number;
  name: string;
  preview: string;
}

export interface FormData {
  comicName: string;
  genre: string;
  pageSize: string;
}

export interface Character {
  id: string;
  name: string;
  gender: string;
  age: string;
  style: string;
  imageUrl: string;
  appearancePrompt?: string;
  clothingPrompt?: string;
  negativePrompt?: string;
  llmDescription?: string;
}

export interface StoryScene {
  id: string;
  description: string;
}

export interface StoryData {
  title: string;
  overview: string;
  scenes: StoryScene[];
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

export interface ComicPanel {
  id: string;
  imageUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  bubbles: SpeechBubble[];
}

export interface SpeechBubble {
  id: string;
  type: 'speech' | 'thought' | 'narration';
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

export interface ComicPage {
  id: string;
  layout: 'single' | 'double-horizontal' | 'double-vertical' | 'triple' | 'quad';
  panels: ComicPanel[];
  backgroundColor: string;
}

export interface ComicProject {
  id: string;
  title: string;
  pages: ComicPage[];
}

export interface DraggedImage {
  imageUrl: string;
  visualizationId: string;
}