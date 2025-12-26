import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
    url: string;
    projectId?: string;
    isPlaying: boolean;
    playingProjectId: string | null;
    onPlay: (url: string, projectId?: string) => void;
    className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
    url,
    projectId,
    isPlaying,
    playingProjectId,
    onPlay,
    className = ""
}) => {
    const isCurrent = isPlaying && ((projectId && playingProjectId === projectId) || (!projectId && !playingProjectId));

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onPlay(url, projectId);
            }}
            className={`flex items-center justify-center transition-all ${className} ${isCurrent
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'bg-gray-50 text-gray-600 hover:bg-blue-100 hover:text-blue-600'
                }`}
        >
            {isCurrent ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
    );
};
