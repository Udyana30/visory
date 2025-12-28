import React from 'react';
import { Play, Download, Trash2, Loader2, Calendar } from 'lucide-react';
import { KokoroGenerateResponse } from '../../../types/domain/kokoro';
import { formatDistanceToNow } from 'date-fns';

interface KokoroHistoryViewProps {
    projects: KokoroGenerateResponse[];
    isLoading: boolean;
    onUseAudio: (url: string) => void;
    isPlaying: boolean;
    playingProjectId: string | null;
    onPlay: (url: string, projectId: string) => void;
    onDelete: (id: string) => void;
}

export const KokoroHistoryView: React.FC<KokoroHistoryViewProps> = ({
    projects,
    isLoading,
    onUseAudio,
    isPlaying,
    playingProjectId,
    onPlay,
    onDelete
}) => {
    if (isLoading && projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mb-3" />
                <p>Loading history...</p>
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="w-8 h-8 text-gray-300" />
                </div>
                <p className="font-medium text-gray-900">No history yet</p>
                <p className="text-sm mt-1">Generated audio will appear here</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {projects.map((project) => (
                <div key={project.tts_id} className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-indigo-100 hover:shadow-sm transition-all group">
                    <div className="flex items-center gap-4">
                        {/* Audio Player - Moved to Left */}
                        <div className="shrink-0">
                            {project.audio_url ? (
                                <button
                                    onClick={() => onPlay(project.audio_url!, project.tts_id)}
                                    className={`w-12 h-12 flex items-center justify-center rounded-full transition-all ${isPlaying && playingProjectId === project.tts_id
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                        : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                                        }`}
                                >
                                    {isPlaying && playingProjectId === project.tts_id ? (
                                        <div className="w-4 h-4 bg-current rounded-sm" />
                                    ) : (
                                        <Play className="w-5 h-5 fill-current ml-1" />
                                    )}
                                </button>
                            ) : (
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider rounded-full">
                                    {project.voice}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                                </span>
                            </div>
                            <p className="text-sm text-gray-900 line-clamp-2 font-medium leading-relaxed">
                                {project.text}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                            {project.audio_url && (
                                <button
                                    onClick={() => onUseAudio(project.audio_url!)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                                    title="Use this audio"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                </button>
                            )}

                            <button
                                onClick={() => {
                                    if (confirm('Are you sure you want to delete this item?')) {
                                        onDelete(project.tts_id);
                                    }
                                }}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
