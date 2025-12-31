'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { chatterboxService } from '../services/tts/chatterboxService';
import { VoiceSample } from '../types/domain/chatterbox';
import { useAuth } from '@/hooks/useAuth';

const LIMIT = 50;

interface VoiceLibraryContextType {
    voices: VoiceSample[];
    isLoading: boolean; // Initial load
    isFetchingMore: boolean; // Pagination
    error: string | null;
    hasMore: boolean;
    loadMore: () => Promise<void>;
    refresh: () => Promise<void>;
    uploadVoice: (file: File, name: string, description?: string, isPublic?: boolean) => Promise<void>;
    deleteVoice: (voiceId: string) => Promise<void>;
}

const VoiceLibraryContext = createContext<VoiceLibraryContextType | undefined>(undefined);

export const VoiceLibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const userId = user?.id ? String(user.id) : undefined;

    const [voices, setVoices] = useState<VoiceSample[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const offsetRef = useRef(0);
    const isFetchingRef = useRef(false);
    const initializedRef = useRef(false);

    const fetchVoices = useCallback(async (reset = false) => {
        if (!userId) {
            setIsLoading(false);
            return;
        }
        if (isFetchingRef.current) return;
        if (!reset && !hasMore) return;

        isFetchingRef.current = true;

        if (reset) {
            setIsLoading(true);
        } else {
            setIsFetchingMore(true);
        }

        setError(null);

        try {
            const currentOffset = reset ? 0 : offsetRef.current;
            console.log(`[VoiceLibrary] Fetching voices. Offset: ${currentOffset}, Limit: ${LIMIT}`);

            const data = await chatterboxService.getVoices(userId, true, LIMIT, currentOffset);
            console.log(`[VoiceLibrary] Received ${data.length} items`);

            if (data.length < LIMIT) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            setVoices(prev => {
                const currentVoices = reset ? [] : prev;
                const existingIds = new Set(currentVoices.map(v => v.voice_sample_id));
                const uniqueNewVoices = data.filter(v => !existingIds.has(v.voice_sample_id));

                console.log(`[VoiceLibrary] Unique new items: ${uniqueNewVoices.length}`);

                // If we got data but all were duplicates, and we're not resetting, stop pagination
                if (!reset && data.length > 0 && uniqueNewVoices.length === 0) {
                    console.warn("[VoiceLibrary] Server returned only duplicates. This usually means the server ignores 'offset'. Stopping pagination.");
                    setHasMore(false);
                    return currentVoices;
                }

                return [...currentVoices, ...uniqueNewVoices];
            });

            offsetRef.current = currentOffset + data.length;

        } catch (err: any) {
            console.error("Fetch voices error:", {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data,
            });
            setError(err.message || 'Failed to fetch voices');
        } finally {
            setIsLoading(false);
            setIsFetchingMore(false);
            isFetchingRef.current = false;
        }
    }, [userId, hasMore]);

    const uploadVoice = async (file: File, name: string, description?: string, isPublic: boolean = false) => {
        if (!userId) throw new Error("User ID required");
        // Don't set global loading for upload, handle it in UI
        try {
            await chatterboxService.uploadVoice({
                audio_file: file,
                name,
                description,
                is_public: isPublic,
                user_id: userId
            });
            // Refresh list after upload
            await fetchVoices(true);
        } catch (err: any) {
            const msg = err.response?.data?.detail || err.message || 'Failed to upload voice';
            throw new Error(msg);
        }
    };

    const deleteVoice = async (voiceId: string) => {
        if (!userId) throw new Error("User ID required");
        try {
            await chatterboxService.deleteVoice(voiceId, userId);
            setVoices(prev => prev.filter(v => v.voice_sample_id !== voiceId));
        } catch (err: any) {
            const msg = err.response?.data?.detail || err.message || 'Failed to delete voice';
            throw new Error(msg);
        }
    };

    // Initial fetch
    useEffect(() => {
        if (userId && !initializedRef.current) {
            fetchVoices(true);
            initializedRef.current = true;
        } else if (!userId) {
            setIsLoading(false);
        }
    }, [userId, fetchVoices]);

    // Reset initialization if user changes
    useEffect(() => {
        if (!userId) {
            initializedRef.current = false;
            setVoices([]);
            offsetRef.current = 0;
            setHasMore(true);
        }
    }, [userId]);

    return (
        <VoiceLibraryContext.Provider value={{
            voices,
            isLoading,
            isFetchingMore,
            error,
            hasMore,
            loadMore: () => fetchVoices(false),
            refresh: () => fetchVoices(true),
            uploadVoice,
            deleteVoice
        }}>
            {children}
        </VoiceLibraryContext.Provider>
    );
};

export const useVoiceLibraryContext = () => {
    const context = useContext(VoiceLibraryContext);
    if (context === undefined) {
        throw new Error('useVoiceLibraryContext must be used within a VoiceLibraryProvider');
    }
    return context;
};
