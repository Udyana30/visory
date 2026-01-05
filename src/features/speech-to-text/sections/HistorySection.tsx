import React from 'react';
import { History } from 'lucide-react';
import HistoryCard from '../components/HistoryCard';
import { STTHistoryItem } from '@/types/stt';

interface HistorySectionProps {
    history: STTHistoryItem[];
    isLoading: boolean;
    onPlay: (item: STTHistoryItem) => void;
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-gray-200">
                    <div className="p-2 bg-gray-100 rounded-lg">
                        <History size={18} className="text-gray-900" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">History</h2>
                </div>
                <div className="flex justify-center py-12 px-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-black" />
                </div>
            </div>
        );
    }

    if (!history || history.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-gray-200">
                    <div className="p-2 bg-gray-100 rounded-lg">
                        <History size={18} className="text-gray-900" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">History</h2>
                </div>
                <div className="text-center py-12 px-6">
                    <div className="flex flex-col items-center gap-3">
                        <div className="p-3.5 bg-gray-100 rounded-full">
                            <History size={28} className="text-gray-400" />
                        </div>
                        <p className="text-gray-600 font-semibold text-sm">No history yet</p>
                        <p className="text-xs text-gray-500">Your transcriptions will appear here</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-gray-200">
                <div className="p-2 bg-gray-100 rounded-lg">
                    <History size={18} className="text-gray-900" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">History</h2>
                <span className="ml-auto text-sm text-gray-500 font-medium">{history.length} items</span>
            </div>

            <div className="p-6">
                <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-6">
                    {history.map((item) => (
                        <div key={item.id} className="flex-shrink-0 w-72">
                            <HistoryCard
                                item={item}
                                isCurrentlyPlaying={currentPlayingId === item.id}
                                onPlay={onPlay}
                                onDelete={onDelete}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
        </div>
    );
};

export default HistorySection;
