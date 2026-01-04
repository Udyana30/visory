import React, { useState, useMemo } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useVoiceLibrary } from '../../../hooks/tts/useVoiceLibrary';
import { VoiceSample } from '../../../types/domain/chatterbox';
import { VoiceLibraryFilters } from '../shared/library/VoiceLibraryFilters';
import { VoiceLibraryGrid } from '../shared/library/VoiceLibraryGrid';

interface ChatterboxVoiceLibraryContainerProps {
    userId?: string;
    selectedId?: string;
    onSelect: (voice: VoiceSample) => void;
    onBack: () => void;
}

export const ChatterboxVoiceLibraryContainer: React.FC<ChatterboxVoiceLibraryContainerProps> = ({
    userId,
    selectedId,
    onSelect,
    onBack
}) => {
    const { voices, isLoading } = useVoiceLibrary(userId);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredVoices = useMemo(() => {
        return voices.filter(voice =>
            voice.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [voices, searchQuery]);

    const handleSelect = (voiceId: string) => {
        const voice = voices.find(v => v.voice_sample_id === voiceId);
        if (voice) {
            onSelect(voice);
            onBack();
        }
    };

    return (
        <div className="bg-white w-full flex flex-col overflow-hidden h-full">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3 bg-white shrink-0">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-50 rounded-full text-gray-500 hover:text-gray-900 transition-colors -ml-2"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Voice Library</h3>
                    <p className="text-sm text-gray-500">Select a voice for ChatterBox</p>
                </div>
            </div>

            {/* Filters - Only Search */}
            <div className="px-6 pt-4 pb-2 bg-white shrink-0">
                <VoiceLibraryFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    showGenderFilter={false}
                    showLanguageFilter={false}
                />
            </div>

            {/* Voice Grid */}
            <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50/50 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                <VoiceLibraryGrid
                    voices={filteredVoices.map(v => ({
                        id: v.voice_sample_id,
                        name: v.name,
                        language: v.description || undefined
                    }))}
                    selectedId={selectedId}
                    onSelect={handleSelect}
                    isLoading={isLoading}
                    accentColor="blue"
                />
            </div>
        </div>
    );
};
