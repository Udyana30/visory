import React from 'react';
import { Play, Download, Trash2, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface HistoryCardProps {
    id: string;
    text: string;
    audioUrl?: string;
    createdAt: string;
    badge?: {
        label: string;
        color: 'indigo' | 'blue' | 'green' | 'purple';
    };
    modeIcon?: React.ReactNode;
    isPlaying: boolean;
    onPlay: (url: string, id: string) => void;
    onUseAudio: (url: string) => void;
    onDelete: (id: string) => void;
    accentColor?: 'indigo' | 'blue';
}

export const HistoryCard: React.FC<HistoryCardProps> = ({
    id,
    text,
    audioUrl,
    createdAt,
    badge,
    modeIcon,
    isPlaying,
    onPlay,
    onUseAudio,
    onDelete,
    accentColor = 'indigo'
}) => {
    const colorClasses = {
        indigo: {
            playBg: 'bg-indigo-600',
            playBgHover: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
            playShadow: 'shadow-lg shadow-indigo-600/20',
            badgeBg: 'bg-indigo-50 text-indigo-600'
        },
        blue: {
            playBg: 'bg-blue-600',
            playBgHover: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
            playShadow: 'shadow-lg shadow-blue-600/20',
            badgeBg: 'bg-blue-50 text-blue-600'
        },
        green: {
            badgeBg: 'bg-green-50 text-green-600'
        },
        purple: {
            badgeBg: 'bg-purple-50 text-purple-600'
        }
    };

    const colors = colorClasses[accentColor];

    return (
        <div
            onClick={() => audioUrl && onUseAudio(audioUrl)}
            className={`bg-white border border-gray-100 rounded-2xl p-4 hover:border-${accentColor}-100 hover:shadow-sm transition-all group cursor-pointer relative`}
        >
            <div className="flex items-center gap-4">
                {/* Play Button - Left */}
                <div className="shrink-0">
                    {audioUrl ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onPlay(audioUrl, id);
                            }}
                            className={`w-12 h-12 flex items-center justify-center rounded-full transition-all ${isPlaying
                                ? `${colors.playBg} text-white ${colors.playShadow}`
                                : colors.playBgHover
                                }`}
                        >
                            {isPlaying ? (
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

                {/* Content - Center */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        {badge && (
                            <span className={`px-2 py-0.5 ${colorClasses[badge.color].badgeBg} text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5`}>
                                {modeIcon && (
                                    <span className="-ml-0.5 flex items-center justify-center">
                                        {modeIcon}
                                    </span>
                                )}
                                {badge.label}
                            </span>
                        )}
                        <span className="text-xs text-gray-400 font-medium">
                            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                        </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-relaxed">
                        {text}
                    </p>
                </div>

                {/* Actions - Right */}
                <div className="flex items-center gap-2 shrink-0">
                    {audioUrl && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                const link = document.createElement('a');
                                link.href = audioUrl;
                                link.target = '_blank';
                                link.download = `generated-audio-${id}.wav`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100"
                            title="Download audio"
                        >
                            <Download className="w-3.5 h-3.5" />
                        </button>
                    )}

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Are you sure you want to delete this item?')) {
                                onDelete(id);
                            }
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
