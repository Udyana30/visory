import React from 'react';
import { Pause, Play } from 'lucide-react';
import { TTSProject } from '../../../types/domain/chatterbox';

interface GenerationResultProps {
    project: TTSProject;
    isPlaying: boolean;
    playingProjectId: string | null;
    onPlay: (url: string) => void;
}

export const GenerationResult: React.FC<GenerationResultProps> = ({
    project,
    isPlaying,
    playingProjectId,
    onPlay
}) => {
    if (project.status !== 'completed' || !project.audio_url) return null;

    return (
        <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <h4 className="text-sm font-bold text-emerald-900">Generation Ready</h4>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md">Success</span>
            </div>
            <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                <button
                    onClick={() => onPlay(project.audio_url!)}
                    className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 hover:scale-105 transition-all active:scale-95"
                >
                    {isPlaying && !playingProjectId ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                </button>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-emerald-500 transition-all duration-300 ${isPlaying && !playingProjectId ? 'w-full animate-[progress_2s_linear_infinite]' : 'w-0'}`} />
                </div>
            </div>
        </div>
    );
};
