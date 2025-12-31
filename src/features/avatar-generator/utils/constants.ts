/**
 * Constants and configurations for TTS features
 */

import { ProjectType, ProjectStatus, TTSEngine } from '../types/domain/common';

// ============================================================================
// STORAGE KEYS
// ============================================================================

export const STORAGE_KEYS = {
    TTS_ENGINE: 'tts_active_engine',
} as const;

// ============================================================================
// CACHE DURATIONS (in milliseconds)
// ============================================================================

export const CACHE_DURATIONS = {
    VOICES: 5 * 60 * 1000,
    HISTORY: 30 * 1000,
    PROJECTS: 30 * 1000,
    VOICE_LIBRARY: 5 * 60 * 1000
} as const;

// ============================================================================
// POLLING CONFIGURATION
// ============================================================================

export const POLLING_CONFIG = {
    INTERVAL: 5000,
    MAX_ATTEMPTS: Infinity,
} as const;


// ============================================================================
// PAGINATION DEFAULTS
// ============================================================================

export const PAGINATION_DEFAULTS = {
    LIMIT: 50,
    OFFSET: 0,
} as const;

// ============================================================================
// PROJECT TYPE LABELS
// ============================================================================

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
    [ProjectType.TTS]: 'Voice Cloning',
    [ProjectType.MULTILINGUAL_TTS]: 'Multilingual',
    [ProjectType.VOICE_CONVERSION]: 'Voice Changer',
};

/**
 * Get label for project type (with fallback for string values)
 */
export const getProjectTypeLabel = (type: string): string => {
    return PROJECT_TYPE_LABELS[type as ProjectType] || type;
};

// ============================================================================
// PROJECT STATUS COLORS
// ============================================================================

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, { bg: string; text: string }> = {
    [ProjectStatus.COMPLETED]: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-600'
    },
    [ProjectStatus.FAILED]: {
        bg: 'bg-red-50',
        text: 'text-red-600'
    },
    [ProjectStatus.PENDING]: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-600'
    },
    [ProjectStatus.PROCESSING]: {
        bg: 'bg-blue-50',
        text: 'text-blue-600'
    },
};

/**
 * Get colors for project status
 */
export const getProjectStatusColors = (status: string): { bg: string; text: string } => {
    return PROJECT_STATUS_COLORS[status as ProjectStatus] || {
        bg: 'bg-gray-50',
        text: 'text-gray-600'
    };
};

// ============================================================================
// PROJECT TYPE ICONS
// ============================================================================

export const PROJECT_TYPE_ICONS: Record<ProjectType, { bg: string; text: string }> = {
    [ProjectType.TTS]: {
        bg: 'bg-blue-50',
        text: 'text-blue-600'
    },
    [ProjectType.MULTILINGUAL_TTS]: {
        bg: 'bg-purple-50',
        text: 'text-purple-600'
    },
    [ProjectType.VOICE_CONVERSION]: {
        bg: 'bg-orange-50',
        text: 'text-orange-600'
    },
};

/**
 * Get icon colors for project type
 */
export const getProjectTypeColors = (type: string): { bg: string; text: string } => {
    return PROJECT_TYPE_ICONS[type as ProjectType] || {
        bg: 'bg-gray-50',
        text: 'text-gray-600'
    };
};

// ============================================================================
// DEFAULT ENGINE
// ============================================================================

export const DEFAULT_TTS_ENGINE = TTSEngine.KOKORO;

// ============================================================================
// AUDIO FORMATS
// ============================================================================

export const AUDIO_FORMATS = {
    WAV: 'audio/wav',
    MP3: 'audio/mp3',
    OGG: 'audio/ogg',
} as const;

export const DEFAULT_AUDIO_FORMAT = AUDIO_FORMATS.WAV;

// ============================================================================
// FILE SIZE LIMITS
// ============================================================================

export const FILE_SIZE_LIMITS = {
    AUDIO_UPLOAD: 10 * 1024 * 1024,
    VOICE_SAMPLE: 5 * 1024 * 1024,
} as const;
