import React from 'react';
import { Loader2, Calendar } from 'lucide-react';
import { HistoryCard } from './HistoryCard';

interface HistoryItem {
    id: string;
    text: string;
    audioUrl?: string;
    createdAt: string;
    badge?: {
        label: string;
        color: 'indigo' | 'blue' | 'green' | 'purple';
    };
    modeIcon?: React.ReactNode;
}

interface HistoryGridProps {
    items: HistoryItem[];
    isLoading?: boolean;
    playingId: string | null;
    onPlay: (url: string, id: string) => void;
    onUseAudio: (url: string) => void;
    onDelete: (id: string) => void;
    accentColor?: 'indigo' | 'blue';
    emptyMessage?: string;
    emptyDescription?: string;
    hasMore?: boolean;
    isFetchingMore?: boolean;
    onLoadMore?: () => void;
    error?: string | null;
}

export const HistoryGrid: React.FC<HistoryGridProps> = ({
    items,
    isLoading = false,
    playingId,
    onPlay,
    onUseAudio,
    onDelete,
    accentColor = 'indigo',
    emptyMessage = 'No history yet',
    emptyDescription = 'Generated audio will appear here',
    hasMore = false,
    isFetchingMore = false,
    onLoadMore,
    error
}) => {
    if (isLoading && items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mb-3" />
                <p>Loading history...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm text-center">
                {error}
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="w-8 h-8 text-gray-300" />
                </div>
                <p className="font-medium text-gray-900">{emptyMessage}</p>
                <p className="text-sm mt-1">{emptyDescription}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 pb-4">
            {items.map((item) => (
                <HistoryCard
                    key={item.id}
                    id={item.id}
                    text={item.text}
                    audioUrl={item.audioUrl}
                    createdAt={item.createdAt}
                    badge={item.badge}
                    modeIcon={item.modeIcon}
                    isPlaying={playingId === item.id}
                    onPlay={onPlay}
                    onUseAudio={onUseAudio}
                    onDelete={onDelete}
                    accentColor={accentColor}
                />
            ))}

            {hasMore && onLoadMore && (
                <button
                    onClick={onLoadMore}
                    disabled={isFetchingMore}
                    className="w-full py-3 text-sm text-gray-500 hover:text-gray-700 font-medium border border-dashed border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                    {isFetchingMore ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Loading more...
                        </>
                    ) : (
                        'Load More History'
                    )}
                </button>
            )}
        </div>
    );
};
