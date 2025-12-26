import React, { useRef, useCallback, useEffect } from 'react';
import { Loader2, History } from 'lucide-react';
import { TTSProject } from '../../../types/domain/chatterbox';
import { HistoryItem } from './HistoryItem';

interface HistoryListProps {
    projects: TTSProject[];
    isLoading: boolean;
    isFetchingMore?: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    isPlaying: boolean;
    playingProjectId: string | null;
    onPlay: (url: string, projectId?: string) => void;
    onUseAudio: (url: string) => void;
    onDelete: (projectId: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
    projects,
    isLoading,
    isFetchingMore,
    hasMore,
    onLoadMore,
    isPlaying,
    playingProjectId,
    onPlay,
    onUseAudio,
    onDelete
}) => {
    const observer = useRef<IntersectionObserver | null>(null);

    const lastElementRef = useCallback((node: HTMLDivElement) => {
        if (isLoading || isFetchingMore) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                onLoadMore();
            }
        }, {
            threshold: 0,
            rootMargin: '200px'
        });

        if (node) observer.current.observe(node);
    }, [isLoading, isFetchingMore, hasMore, onLoadMore]);

    // Cleanup observer on unmount
    useEffect(() => {
        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, []);

    // Initial Loading State (Empty List)
    if (isLoading && projects.length === 0) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    // Empty State (No Data)
    if (projects.length === 0 && !isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <History className="w-8 h-8 opacity-50" />
                </div>
                <p className="text-sm font-medium">No generation history yet</p>
                <p className="text-xs mt-1">Generated audio will appear here</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 pb-4">
            {projects.map((p, index) => {
                // Attach ref to the 3rd last element to trigger loading earlier
                const isTrigger = index === projects.length - 3 || (projects.length < 3 && index === projects.length - 1);

                return (
                    <HistoryItem
                        key={p.project_id}
                        project={p}
                        innerRef={isTrigger ? lastElementRef : null}
                        isPlaying={isPlaying}
                        playingProjectId={playingProjectId}
                        onPlay={onPlay}
                        onUseAudio={onUseAudio}
                        onDelete={onDelete}
                    />
                );
            })}

            {isFetchingMore && (
                <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
            )}
        </div>
    );
};
