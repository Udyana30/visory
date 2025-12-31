import { TTSEngine } from '../types/domain/common';
import { STORAGE_KEYS, DEFAULT_TTS_ENGINE } from '../utils/constants';

const getTTSEngine = (): TTSEngine => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.TTS_ENGINE);

        if (stored === TTSEngine.KOKORO || stored === TTSEngine.CHATTERBOX) {
            return stored;
        }

        return DEFAULT_TTS_ENGINE;
    } catch (error) {
        console.error('Failed to get TTS engine from localStorage:', error);
        return DEFAULT_TTS_ENGINE;
    }
};

const setTTSEngine = (engine: TTSEngine): void => {
    try {
        localStorage.setItem(STORAGE_KEYS.TTS_ENGINE, engine);
    } catch (error) {
        console.error('Failed to save TTS engine to localStorage:', error);
    }
};

const clearTTSEngine = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEYS.TTS_ENGINE);
    } catch (error) {
        console.error('Failed to clear TTS engine from localStorage:', error);
    }
};

const getItem = <T>(key: string, defaultValue: T): T => {
    try {
        const item = localStorage.getItem(key);

        if (item === null) {
            return defaultValue;
        }

        return JSON.parse(item) as T;
    } catch (error) {
        console.error(`Failed to get item "${key}" from localStorage:`, error);
        return defaultValue;
    }
};

const setItem = <T>(key: string, value: T): void => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Failed to set item "${key}" in localStorage:`, error);
    }
};

const removeItem = (key: string): void => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Failed to remove item "${key}" from localStorage:`, error);
    }
};

const clear = (): void => {
    try {
        localStorage.clear();
    } catch (error) {
        console.error('Failed to clear localStorage:', error);
    }
};

const isAvailable = (): boolean => {
    try {
        const testKey = '__localStorage_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return true;
    } catch {
        return false;
    }
};

export const localStorageService = {
    getTTSEngine,
    setTTSEngine,
    clearTTSEngine,
    getItem,
    setItem,
    removeItem,
    clear,
    isAvailable,
};
