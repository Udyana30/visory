import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useKokoroContext } from '../../../context/KokoroContext';
import { VoiceLibraryFilters } from '../shared/library/VoiceLibraryFilters';
import { VoiceLibraryGrid } from '../shared/library/VoiceLibraryGrid';
import { useAudioPlayer } from '../../../hooks/tts/useAudioPlayer';

interface KokoroVoiceLibraryContainerProps {
    selectedId?: string;
    onSelect: (voiceId: string) => void;
    onBack: () => void;
}

export const KokoroVoiceLibraryContainer: React.FC<KokoroVoiceLibraryContainerProps> = ({
    selectedId,
    onSelect,
    onBack
}) => {
    const { voices, isVoicesLoading } = useKokoroContext();
    const { playingId, toggle: toggleAudio, stop: stopAudio } = useAudioPlayer();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGender, setSelectedGender] = useState<'all' | 'male' | 'female'>('all');
    const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

    // Stop audio when component unmounts
    useEffect(() => {
        return () => {
            stopAudio();
        };
    }, [stopAudio]);

    const languages = useMemo(() => {
        const langs = new Set(voices.map(v => v.language));
        return Array.from(langs).sort();
    }, [voices]);

    const filteredVoices = useMemo(() => {
        return voices.filter(voice => {
            const matchesSearch = voice.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesGender = selectedGender === 'all' || voice.gender === selectedGender;
            const matchesLanguage = selectedLanguage === 'all' || voice.language === selectedLanguage;
            return matchesSearch && matchesGender && matchesLanguage;
        });
    }, [voices, searchQuery, selectedGender, selectedLanguage]);

    const handleSelect = (voiceId: string) => {
        onSelect(voiceId);
        onBack();
    };

    const handlePlay = (audioUrl: string, voiceId: string) => {
        toggleAudio(audioUrl, voiceId);
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
                    <p className="text-sm text-gray-500">Select a voice for Kokoro</p>
                </div>
            </div>

            {/* Filters */}
            <div className="px-6 pt-4 pb-2 bg-white shrink-0">
                <VoiceLibraryFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    showGenderFilter={true}
                    selectedGender={selectedGender}
                    onGenderChange={setSelectedGender}
                    showLanguageFilter={true}
                    languages={languages}
                    selectedLanguage={selectedLanguage}
                    onLanguageChange={setSelectedLanguage}
                />
            </div>

            {/* Voice Grid */}
            <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50/50 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                <VoiceLibraryGrid
                    voices={filteredVoices.map(v => ({
                        id: v.id,
                        name: v.name,
                        gender: v.gender,
                        language: v.language,
                        audioUrl: v.preview_url
                    }))}
                    selectedId={selectedId}
                    onSelect={handleSelect}
                    isLoading={isVoicesLoading}
                    accentColor="indigo"
                    onPlay={handlePlay}
                    playingId={playingId}
                />
            </div>
        </div>
    );
};
