import React, { useState } from 'react';
import { Volume2, Play, Pause, Trash2 } from 'lucide-react';

interface VoiceCardProps {
    id: string;
    name: string;
    gender?: string;
    language?: string;
    isSelected: boolean;
    onSelect: (id: string) => void;
    accentColor?: 'indigo' | 'blue';
    audioUrl?: string;
    onPlay?: (audioUrl: string, id: string) => void;
    isPlaying?: boolean;
    onDelete?: (id: string) => void;
    showDelete?: boolean;
}

export const VoiceCard: React.FC<VoiceCardProps> = ({
    id,
    name,
    gender,
    language,
    isSelected,
    onSelect,
    accentColor = 'indigo',
    audioUrl,
    onPlay,
    isPlaying = false,
    onDelete,
    showDelete = false
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const colorClasses = {
        indigo: {
            border: 'border-indigo-500 ring-1 ring-indigo-500/20',
            bg: 'bg-indigo-100 text-indigo-600',
            bgHover: 'bg-indigo-50 text-indigo-500',
            badge: 'bg-indigo-100 text-indigo-700',
            text: 'text-indigo-900',
            playBg: 'bg-indigo-600 hover:bg-indigo-700'
        },
        blue: {
            border: 'border-blue-500 ring-1 ring-blue-500/20',
            bg: 'bg-blue-100 text-blue-600',
            bgHover: 'bg-blue-50 text-blue-500',
            badge: 'bg-blue-100 text-blue-700',
            text: 'text-blue-900',
            playBg: 'bg-blue-600 hover:bg-blue-700'
        }
    };

    const colors = colorClasses[accentColor];

    const handleCardClick = () => {
        onSelect(id);
    };

    const handleIconClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (audioUrl && onPlay) {
            onPlay(audioUrl, id);
        }
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete && confirm(`Hapus voice "${name}"?`)) {
            onDelete(id);
        }
    };

    // Show play icon when: has audio, has onPlay handler, and is hovered
    const showPlayIcon = audioUrl && onPlay && isHovered;

    return (
        <div
            onClick={handleCardClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${isSelected
                ? `${colors.border} bg-${accentColor}-50 shadow-sm`
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
        >
            <div className="flex items-start gap-3 mb-3">
                {/* Icon - Clickable for preview */}
                <div
                    onClick={handleIconClick}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer ${isSelected
                        ? colors.bg
                        : `bg-gray-100 text-gray-400 group-hover:${colors.bgHover}`
                        }`}
                >
                    {isPlaying ? (
                        <Pause className="w-5 h-5" />
                    ) : showPlayIcon ? (
                        <Play className="w-5 h-5" />
                    ) : (
                        <Volume2 className="w-5 h-5" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-bold truncate transition-colors mb-1 ${isSelected
                        ? colors.text
                        : 'text-gray-900 group-hover:text-gray-900'
                        }`}>
                        {name}
                    </h4>
                    {gender && (
                        <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md ${isSelected
                                ? colors.badge
                                : `bg-gray-100 text-gray-600 group-hover:${colors.badge}`
                                }`}>
                                {gender}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Section */}
            <div className="flex items-center justify-between gap-2">
                {language && (
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-lg ${isSelected
                        ? `bg-white ${colors.text} border border-${accentColor}-200`
                        : `bg-gray-50 text-gray-600 border border-gray-200 group-hover:border-${accentColor}-200 group-hover:${colors.text}`
                        }`}>
                        {language}
                    </span>
                )}

                <div className="flex items-center gap-1.5 ml-auto">
                    {/* Delete Button */}
                    {showDelete && onDelete && (
                        <div
                            onClick={handleDeleteClick}
                            className="w-7 h-7 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                            title="Delete voice"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
