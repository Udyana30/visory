import React from 'react';
import { History } from 'lucide-react';
import HistoryCard from '../components/HistoryCard';
import { TTSHistoryItem } from '@/types/tts';

interface HistorySectionProps {
  history: TTSHistoryItem[];
  isLoading: boolean;
  onPlay: (item: TTSHistoryItem) => void;
  onDelete?: (id: number) => void;
  currentPlayingId?: number;
}

const HistorySection: React.FC<HistorySectionProps> = ({
  history,
  isLoading,
  onPlay,
  onDelete,
  currentPlayingId,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[445px] flex flex-col overflow-hidden pb-6">
        <div className="flex items-center gap-3 p-6 pb-4 border-b border-gray-200 flex-shrink-0">
          <div className="p-2 bg-gray-100 rounded-lg">
            <History size={20} className="text-gray-900" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">History</h2>
        </div>
        <div className="flex justify-center py-8 px-6 flex-1 items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-black" />
        </div>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[445px] flex flex-col overflow-hidden pb-6">
        <div className="flex items-center gap-3 p-6 pb-4 border-b border-gray-200 flex-shrink-0">
          <div className="p-2 bg-gray-100 rounded-lg">
            <History size={20} className="text-gray-900" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">History</h2>
        </div>
        <div className="text-center py-12 px-6 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 bg-gray-100 rounded-full">
              <History size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No history yet</p>
            <p className="text-sm text-gray-400">Your generated audios will appear here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[445px] flex flex-col overflow-hidden pb-6">
      <div className="flex items-center gap-3 p-6 pb-4 border-b border-gray-200 flex-shrink-0">
        <div className="p-2 bg-gray-100 rounded-lg">
          <History size={20} className="text-gray-900" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">History</h2>
        <span className="ml-auto text-sm text-gray-500">{history.length} items</span>
      </div>

      <div className="overflow-y-auto flex-1 custom-scrollbar">
        <div className="space-y-4 p-6">
          {history.map((item) => (
            <HistoryCard
              key={item.id}
              item={item}
              isCurrentlyPlaying={currentPlayingId === item.id}
              onPlay={onPlay}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default HistorySection;