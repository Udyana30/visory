import React from 'react';
import { Play, Download, Trash2, Clock } from 'lucide-react';
import { TTSHistoryItem } from '@/types/tts';
import { formatDateTime, truncateText } from '../lib/tts.utils';

interface HistoryCardProps {
  item: TTSHistoryItem;
  isCurrentlyPlaying: boolean;
  onPlay: (item: TTSHistoryItem) => void;
  onDelete?: (id: number) => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({
  item,
  isCurrentlyPlaying,
  onPlay,
  onDelete,
}) => {
  return (
    <div
      className={`p-4 border rounded-lg hover:shadow-sm transition-all ${
        isCurrentlyPlaying 
          ? 'border-black bg-gray-50' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">
            {item.title}
          </h4>
          {item.input_text && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {truncateText(item.input_text, 100)}
            </p>
          )}
        </div>
        {isCurrentlyPlaying && (
          <div className="flex-shrink-0">
            <div className="flex items-center gap-1">
              <div className="w-1 h-3 bg-black rounded-full animate-pulse" />
              <div className="w-1 h-4 bg-black rounded-full animate-pulse delay-75" />
              <div className="w-1 h-3 bg-black rounded-full animate-pulse delay-150" />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
        <Clock size={14} />
        <span>{formatDateTime(item.created_at)}</span>
        <span className="mx-1">•</span>
        <span>{item.voice_name}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPlay(item)}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            isCurrentlyPlaying
              ? 'bg-black text-white'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          <Play size={14} />
          {isCurrentlyPlaying ? 'Playing' : 'Play'}
        </button>
        <a
          href={item.output_speech_url}
          download
          className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Download size={14} />
        </a>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .delay-75 {
          animation-delay: 75ms;
        }
        .delay-150 {
          animation-delay: 150ms;
        }
      `}</style>
    </div>
  );
};

export default HistoryCard;