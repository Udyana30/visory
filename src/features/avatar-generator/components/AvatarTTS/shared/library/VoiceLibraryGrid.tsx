import React from 'react';
import { Search, Mic } from 'lucide-react';
import { VoiceCard } from './VoiceCard';

interface Voice {
    id: string;
    name: string;
    gender?: string;
    language?: string;
}

interface VoiceLibraryGridProps {
    voices: Voice[];
    selectedId?: string;
    onSelect: (id: string) => void;
    isLoading?: boolean;
    accentColor?: 'indigo' | 'blue';
}

export const VoiceLibraryGrid: React.FC<VoiceLibraryGridProps> = ({
    voices,
    selectedId,
    onSelect,
    isLoading = false,
    accentColor = 'indigo'
}) => {
    if (isLoading && voices.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-3" />
                <p className="text-sm">Loading voices...</p>
            </div>
        );
    }

    if (voices.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Search className="w-10 h-10 mb-3 opacity-50" />
                <p className="text-sm font-medium">No voices found</p>
                <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-3">
            {voices.map((voice) => (
                <VoiceCard
                    key={voice.id}
                    id={voice.id}
                    name={voice.name}
                    gender={voice.gender}
                    language={voice.language}
                    isSelected={selectedId === voice.id}
                    onSelect={onSelect}
                    accentColor={accentColor}
                />
            ))}
        </div>
    );
};
