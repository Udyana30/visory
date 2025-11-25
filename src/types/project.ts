export type ProjectType = 'stt' | 'tts' | 'comic';

export interface PageSize {
  width: number;
  height: number;
}

export interface BaseProject {
  id: number;
  name?: string;
  title?: string;
  created_at: string;
  updated_at?: string;
  project_type: ProjectType;
}

export interface STTProject extends BaseProject {
  project_type: 'stt';
  title: string;
  input_audio_url?: string;
  output_raw_text?: string;
  language?: string;
}

export interface TTSProject extends BaseProject {
  project_type: 'tts';
  title: string;
  input_text?: string;
  output_speech_url?: string;
  voice_name?: string;
  rate?: string;
  volume?: string;
  pitch?: string;
}

export interface ComicProject extends BaseProject {
  project_type: 'comic';
  name: string;
  page_size?: PageSize;
  art_style?: string;
}

export type UnifiedProject = STTProject | TTSProject | ComicProject;

export const getProjectDisplayName = (project: UnifiedProject): string => {
  if (project.project_type === 'comic') {
    return project.name || 'Untitled Comic';
  }
  return project.title || 'Untitled Project';
};

export const getProjectAudioUrl = (project: UnifiedProject): string | undefined => {
  if (project.project_type === 'stt') {
    return project.input_audio_url;
  }
  if (project.project_type === 'tts') {
    return project.output_speech_url;
  }
  return undefined;
};