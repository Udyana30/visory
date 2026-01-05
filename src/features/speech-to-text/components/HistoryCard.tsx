import React from 'react';
import { Trash2, FileAudio } from 'lucide-react';
import { STTHistoryItem } from '@/types/stt';
import { formatDateTime } from '../utils/utils';

interface HistoryCardProps {
    item: STTHistoryItem;
    isCurrentlyPlaying: boolean;
    onPlay: (item: STTHistoryItem) => void;
    onDelete?: (id: number) => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ item, isCurrentlyPlaying, onPlay, onDelete }) => {
    return (
        <div
            onClick={() => onPlay(item)}
            className={`group relative bg-gray-50 border rounded-lg p-4 transition-all hover:shadow-md cursor-pointer ${isCurrentlyPlaying ? 'border-black bg-gray-100 ring-2 ring-black ring-opacity-20' : 'border-gray-200'
                }`}
        >
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileAudio size={18} className="text-gray-900 flex-shrink-0" />
                    <h3 className="font-semibold text-gray-900 truncate text-sm">{item.title}</h3>
                </div>

                {onDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-red-600 text-white rounded hover:bg-red-700 flex-shrink-0"
                        title="Delete"
                    >
                        <Trash2 size={14} />
                    </button>
                )}
            </div>

            <div className="space-y-2 mb-3">
                <p className="text-xs text-gray-600 uppercase font-medium">
                    Language: {item.language}
                </p>
                <p className="text-xs text-gray-500">{formatDateTime(item.created_at)}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded p-3 h-16 overflow-hidden">
                <p className="text-xs text-gray-700 leading-relaxed line-clamp-3">
                    {item.output_raw_text}
                </p>
            </div>
        </div>
    );
};

export default HistoryCard;
