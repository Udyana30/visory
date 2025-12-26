import React, { useState } from 'react';
import { Mic, Globe, FileAudio, Calendar, Trash2, Loader2 } from 'lucide-react';
import { TTSProject } from '../../../types/domain/chatterbox';
import { AudioPlayer } from '../shared/AudioPlayer';

interface HistoryItemProps {
    project: TTSProject;
    isPlaying: boolean;
    playingProjectId: string | null;
    onPlay: (url: string, projectId?: string) => void;
    onUseAudio: (url: string) => void;
    onDelete: (projectId: string) => void;
    innerRef?: React.Ref<HTMLDivElement>;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({
    project,
    isPlaying,
    playingProjectId,
    onPlay,
    onUseAudio,
    onDelete,
    innerRef
}) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this project?')) {
            setIsDeleting(true);
            try {
                await onDelete(project.project_id);
            } catch (error) {
                console.error("Failed to delete", error);
                setIsDeleting(false);
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getProjectTypeLabel = (type: string) => {
        switch (type) {
            case 'tts': return 'Voice Cloning';
            case 'multilingual_tts': return 'Multilingual';
            case 'voice-conversion':
            case 'voice_conversion': return 'Voice Changer';
            default: return type;
        }
    };

    return (
        <div
            ref={innerRef}
            onClick={() => project.status === 'completed' && project.audio_url && onUseAudio(project.audio_url)}
            className={`bg-white p-4 rounded-2xl border border-gray-100 transition-all group relative ${project.status === 'completed' ? 'hover:border-blue-300 hover:shadow-md cursor-pointer active:scale-[0.99]' : ''
                }`}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${project.project_type === 'tts' ? 'bg-blue-50 text-blue-600' :
                        project.project_type === 'multilingual_tts' ? 'bg-purple-50 text-purple-600' :
                            'bg-orange-50 text-orange-600'
                        }`}>
                        {project.project_type === 'tts' ? <Mic className="w-5 h-5" /> :
                            project.project_type === 'multilingual_tts' ? <Globe className="w-5 h-5" /> :
                                <FileAudio className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-gray-900 px-2 py-0.5 bg-gray-100 rounded-md">
                                {getProjectTypeLabel(project.project_type)}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${project.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                                project.status === 'failed' ? 'bg-red-50 text-red-600' :
                                    'bg-yellow-50 text-yellow-600'
                                }`}>
                                {project.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-700 font-medium truncate mb-1.5" title={project.text}>
                            {project.text || 'No text content'}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(project.created_at)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 z-10">
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                        title="Delete Project"
                    >
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>

                    {project.status === 'completed' && project.audio_url && (
                        <div onClick={(e) => e.stopPropagation()}>
                            <AudioPlayer
                                url={project.audio_url}
                                projectId={project.project_id}
                                isPlaying={isPlaying}
                                playingProjectId={playingProjectId}
                                onPlay={onPlay}
                                className="w-10 h-10 rounded-full"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
