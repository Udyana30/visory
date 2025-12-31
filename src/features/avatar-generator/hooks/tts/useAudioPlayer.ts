import { useState, useRef, useCallback } from 'react';

export const useAudioPlayer = () => {
    const [currentTrack, setCurrentTrack] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const toggle = useCallback((url: string) => {
        if (isPlaying && currentTrack === url) {
            audioRef.current?.pause();
            setIsPlaying(false);
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            audioRef.current = new Audio(url);

            // Handle audio ending
            audioRef.current.onended = () => {
                setIsPlaying(false);
                setCurrentTrack(null);
            };

            // Handle errors
            audioRef.current.onerror = () => {
                console.error("Error playing audio");
                setIsPlaying(false);
                setCurrentTrack(null);
            };

            audioRef.current.play().catch(err => {
                console.error("Playback failed:", err);
                setIsPlaying(false);
            });

            setIsPlaying(true);
            setCurrentTrack(url);
        }
    }, [isPlaying, currentTrack]);

    const stop = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);
        setCurrentTrack(null);
    }, []);

    return {
        currentTrack,
        isPlaying,
        toggle,
        stop
    };
};
