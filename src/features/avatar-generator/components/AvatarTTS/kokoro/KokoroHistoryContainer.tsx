import React from 'react';
import { useKokoroContext } from '../../../context/KokoroContext';
import { HistoryGrid } from '../shared/history/HistoryGrid';

interface KokoroHistoryContainerProps {
    userId?: string;
    onUseAudio: (url: string) => void;
    isPlaying: boolean;
    playingProjectId: string | null;
    onPlay: (url: string, projectId: string) => void;
}

export const KokoroHistoryContainer: React.FC<KokoroHistoryContainerProps> = ({
    onUseAudio,
    isPlaying,
    playingProjectId,
    onPlay
}) => {
    const { projects, isHistoryLoading, removeProject } = useKokoroContext();

    const historyItems = projects.map(project => ({
        id: project.tts_id,
        text: project.text,
        audioUrl: project.audio_url || undefined,
        createdAt: project.created_at,
        badge: {
            label: project.voice,
            color: 'indigo' as const
        }
    }));

    return (
        <HistoryGrid
            items={historyItems}
            isLoading={isHistoryLoading}
            playingId={playingProjectId}
            onPlay={onPlay}
            onUseAudio={onUseAudio}
            onDelete={removeProject}
            accentColor="indigo"
        />
    );
};
