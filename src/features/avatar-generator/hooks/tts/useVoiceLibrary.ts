import { useVoiceLibraryContext } from '../../context/VoiceLibraryContext';
import { VoiceSample } from '../../types/domain/chatterbox';

export interface UseVoiceLibraryResult {
    voices: VoiceSample[];
    isLoading: boolean;
    isFetchingMore: boolean;
    error: string | null;
    hasMore: boolean;
    loadMore: () => Promise<void>;
    refresh: () => Promise<void>;
    uploadVoice: (file: File, name: string, description?: string, isPublic?: boolean) => Promise<void>;
    deleteVoice: (voiceId: string) => Promise<void>;
    addVoice: (voice: VoiceSample) => void;
}

export const useVoiceLibrary = (userId?: string): UseVoiceLibraryResult => {
    return useVoiceLibraryContext();
};
