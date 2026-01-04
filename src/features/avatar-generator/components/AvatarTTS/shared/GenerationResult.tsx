import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, RotateCcw, Check, Loader2, Volume2 } from 'lucide-react';

interface GenerationResultProps {
    audioUrl: string | null;
    status: 'idle' | 'generating' | 'completed' | 'error';
    onUse: () => void;
    onRegenerate: () => void;
    isDownloading?: boolean;
    accentColor?: 'indigo' | 'blue' | 'emerald';
}

export const GenerationResult: React.FC<GenerationResultProps> = ({
    audioUrl,
    status,
    onUse,
    onRegenerate,
    isDownloading = false,
    accentColor = 'blue'
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const colorClasses = {
        indigo: {
            bg: 'bg-indigo-50',
            border: 'border-indigo-100',
            text: 'text-indigo-900',
            subtext: 'text-indigo-600',
            button: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20',
            progress: 'bg-indigo-600',
            light: 'bg-indigo-100'
        },
        blue: {
            bg: 'bg-blue-50',
            border: 'border-blue-100',
            text: 'text-blue-900',
            subtext: 'text-blue-600',
            button: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20',
            progress: 'bg-blue-600',
            light: 'bg-blue-100'
        },
        emerald: {
            bg: 'bg-emerald-50',
            border: 'border-emerald-100',
            text: 'text-emerald-900',
            subtext: 'text-emerald-600',
            button: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20',
            progress: 'bg-emerald-600',
            light: 'bg-emerald-100'
        }
    };

    const colors = colorClasses[accentColor];

    useEffect(() => {
        if (audioUrl) {
            audioRef.current = new Audio(audioUrl);
            audioRef.current.addEventListener('loadedmetadata', () => {
                setDuration(audioRef.current?.duration || 0);
            });
            audioRef.current.addEventListener('timeupdate', () => {
                const current = audioRef.current?.currentTime || 0;
                const total = audioRef.current?.duration || 1;
                setProgress((current / total) * 100);
            });
            audioRef.current.addEventListener('ended', () => {
                setIsPlaying(false);
                setProgress(0);
            });

            return () => {
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current = null;
                }
            };
        }
    }, [audioUrl]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (status !== 'completed' || !audioUrl) return null;

    return (
        <div className={`p-5 rounded-2xl border ${colors.bg} ${colors.border} animate-in fade-in slide-in-from-bottom-4`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${colors.light}`}>
                        <Volume2 className={`w-4 h-4 ${colors.subtext}`} />
                    </div>
                    <h3 className={`text-sm font-bold ${colors.text}`}>Generated Audio</h3>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${colors.subtext} bg-white px-2 py-1 rounded-md border ${colors.border}`}>
                    Ready to use
                </span>
            </div>

            {/* Player */}
            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm mb-4 flex items-center gap-3">
                <button
                    onClick={togglePlay}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all active:scale-95 shadow-lg ${colors.button}`}
                >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>

                <div className="flex-1 space-y-1.5">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden w-full">
                        <div
                            className={`h-full rounded-full transition-all duration-100 ${colors.progress}`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] font-medium text-gray-400">
                        <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    onClick={onUse}
                    disabled={isDownloading}
                    className={`flex-1 px-4 py-2.5 text-white text-sm font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95 ${colors.button}`}
                >
                    {isDownloading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <Check className="w-4 h-4" />
                            <span>Use Audio</span>
                        </>
                    )}
                </button>
                <button
                    onClick={onRegenerate}
                    disabled={isDownloading}
                    className="px-4 py-2.5 bg-white text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all border border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 active:scale-95"
                >
                    <RotateCcw className="w-4 h-4" />
                    <span>Again</span>
                </button>
            </div>
        </div>
    );
};
