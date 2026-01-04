import { useState, useRef, useCallback } from 'react';

export const useAudioPlayer = () => {
    const [currentTrack, setCurrentTrack] = useState<string | null>(null);
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const toggle = useCallback((url: string, id?: string) => {
        const targetId = id || url; // Use URL as ID if no ID provided

        if (isPlaying && (playingId === targetId)) {
            audioRef.current?.pause();
            setIsPlaying(false);
            setPlayingId(null);
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            audioRef.current = new Audio(url);

            // Handle audio ending
            audioRef.current.onended = () => {
                setIsPlaying(false);
                setCurrentTrack(null);
                setPlayingId(null);
            };

            // Handle errors
            audioRef.current.onerror = () => {
                console.error("Error playing audio");
                setIsPlaying(false);
                setCurrentTrack(null);
                setPlayingId(null);
            };

            audioRef.current.play().catch(err => {
                console.error("Playback failed:", err);
                setIsPlaying(false);
                setPlayingId(null);
            });

            setIsPlaying(true);
            setCurrentTrack(url);
            setPlayingId(targetId);
        }
    }, [isPlaying, playingId]);

    const stop = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);
        setCurrentTrack(null);
        setPlayingId(null);
    }, []);

    return {
        currentTrack,
        playingId,
        isPlaying,
        toggle,
        stop
    };
};
