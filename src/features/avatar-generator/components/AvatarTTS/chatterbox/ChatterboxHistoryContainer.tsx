import React from 'react';
import { Users, Globe, Mic2 } from 'lucide-react';
import { useChatterboxContext } from '../../../context/ChatterboxContext';
import { HistoryGrid } from '../shared/history/HistoryGrid';

interface ChatterboxHistoryContainerProps {
    userId?: string;
    onUseAudio: (url: string) => void;
    isPlaying: boolean;
    playingProjectId: string | null;
    onPlay: (url: string, projectId?: string) => void;
}

const getModeIcon = (mode: string) => {
    const iconClass = "w-3.5 h-3.5";
    switch (mode) {
        case 'TTS':
        case 'tts':
        case 'cloning':
            return <Users className={iconClass} />;
        case 'multilingual_tts':
        case 'multilingual':
            return <Globe className={iconClass} />;
        case 'voice_conversion':
        case 'voice-changer':
            return <Mic2 className={iconClass} />;
        default:
            return null;
    }
};

const getModeLabel = (mode: string) => {
    switch (mode) {
        case 'TTS':
        case 'tts':
        case 'cloning':
            return 'Voice Cloning';
        case 'multilingual_tts':
        case 'multilingual':
            return 'Multilingual';
        case 'voice_conversion':
        case 'voice-changer':
            return 'Voice Changer';
        default:
            return mode;
    }
};

const getModeColor = (mode: string): 'blue' | 'green' | 'purple' => {
    switch (mode) {
        case 'TTS':
        case 'tts':
        case 'cloning':
            return 'blue';
        case 'multilingual_tts':
        case 'multilingual':
            return 'green';
        case 'voice_conversion':
        case 'voice-changer':
            return 'purple';
        default:
            return 'blue';
    }
};

export const ChatterboxHistoryContainer: React.FC<ChatterboxHistoryContainerProps> = ({
    userId,
    onUseAudio,
    isPlaying,
    playingProjectId,
    onPlay
}) => {
    const {
        projects,
        isLoading,
        isFetchingMore,
        hasMore,
        loadMore,
        error,
        removeProject
    } = useChatterboxContext();

    return (
        <HistoryGrid
            items={projects.map(p => ({
                id: p.project_id,
                text: p.text || (p.project_type === 'voice-conversion' ? 'Voice Conversion' : 'No text'),
                createdAt: p.created_at,
                audioUrl: p.audio_url,
                badge: {
                    label: getModeLabel(p.project_type),
                    color: getModeColor(p.project_type)
                },
                modeIcon: getModeIcon(p.project_type)
            }))}
            isLoading={isLoading}
            isFetchingMore={isFetchingMore}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onPlay={onPlay}
            onUseAudio={onUseAudio}
            onDelete={removeProject}
            playingId={playingProjectId}
            emptyMessage="No generation history found"
            error={error}
        />
    );
};
