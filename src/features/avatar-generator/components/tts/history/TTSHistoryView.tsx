import React from 'react';
import { useTTSGenerator } from '../../../hooks/tts/useTTSGenerator';
import { HistoryList } from './HistoryList';

interface TTSHistoryViewProps {
    userId?: string;
    onUseAudio: (url: string) => void;
    isPlaying: boolean;
    playingProjectId: string | null;
    onPlay: (url: string, projectId?: string) => void;
}

export const TTSHistoryView: React.FC<TTSHistoryViewProps> = ({
    userId,
    onUseAudio,
    isPlaying,
    playingProjectId,
    onPlay
}) => {
    const {
        projects,
        isHistoryLoading,
        isHistoryFetchingMore,
        hasMoreHistory,
        loadMoreHistory,
        deleteProject
    } = useTTSGenerator(userId);

    return (
        <HistoryList
            projects={projects}
            isLoading={isHistoryLoading}
            isFetchingMore={isHistoryFetchingMore}
            hasMore={hasMoreHistory}
            onLoadMore={loadMoreHistory}
            isPlaying={isPlaying}
            playingProjectId={playingProjectId}
            onPlay={onPlay}
            onUseAudio={onUseAudio}
            onDelete={deleteProject}
        />
    );
};
