import { AvatarParameters } from "../types/domain/project";

export const DEFAULT_AVATAR_PARAMS = {
  sampleSteps: 8,
  sampleShift: 3.0,
  textGuideScale: 1.0,
  audioGuideScale: 6.0,
  loraScale: 1.0,
  numPersistentParamInDit: 0,
  seed: 42,
};

export const QUALITY_PRESETS: { label: string; description: string; badge: string; params: Partial<AvatarParameters> }[] = [
  {
    label: 'Standard',
    description: 'Fast generation, suitable for drafts.',
    badge: '480p',
    params: { sampleSteps: 10, sampleShift: 3.0 }
  },
  {
    label: 'High Definition',
    description: 'Balanced quality and speed.',
    badge: '720p',
    params: { sampleSteps: 20, sampleShift: 4.0 }
  },
  {
    label: 'Full HD',
    description: 'Crisp details for production.',
    badge: '1080p',
    params: { sampleSteps: 30, sampleShift: 5.0 }
  },
  {
    label: 'Cinematic',
    description: 'Maximum fidelity, slowest generation.',
    badge: '4K',
    params: { sampleSteps: 50, sampleShift: 6.0 }
  }
];

export const DEFAULT_AVATAR_PROMPT = "A talking head video";
export const POLLING_INTERVAL = 60000;
export const MAX_POLLING_ATTEMPTS = 100;

export const AVATAR_API_ENDPOINTS = {
  BASE: '/',
  BY_ID: (id: string) => `/${id}`,
  STATUS: (id: string) => `/${id}/status`,
};