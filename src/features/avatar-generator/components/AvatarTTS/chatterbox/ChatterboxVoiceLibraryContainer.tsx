import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, Plus } from 'lucide-react';
import { useVoiceLibrary } from '../../../hooks/tts/useVoiceLibrary';
import { VoiceSample } from '../../../types/domain/chatterbox';
import { VoiceLibraryFilters } from '../shared/library/VoiceLibraryFilters';
import { VoiceCard } from '../shared/library/VoiceCard';
import { VoiceUploadForm } from './VoiceUploadForm';
import { useAudioPlayer } from '../../../hooks/tts/useAudioPlayer';

interface ChatterboxVoiceLibraryContainerProps {
    userId?: string;
    selectedId?: string;
    onSelect: (voice: VoiceSample) => void;
    onBack: () => void;
}

type TabType = 'all' | 'my';
type ViewType = 'library' | 'upload';

export const ChatterboxVoiceLibraryContainer: React.FC<ChatterboxVoiceLibraryContainerProps> = ({
    userId,
    selectedId,
    onSelect,
    onBack
}) => {
    const { voices, isLoading, addVoice, deleteVoice } = useVoiceLibrary(userId);
    const { playingId, toggle: toggleAudio, stop: stopAudio } = useAudioPlayer();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [view, setView] = useState<ViewType>('library');

    // Stop audio when component unmounts or tab changes
    useEffect(() => {
        return () => {
            stopAudio();
        };
    }, [stopAudio]);

    // Stop audio when switching tabs
    useEffect(() => {
        stopAudio();
    }, [activeTab, stopAudio]);

    // Filter by tab
    const filteredByTab = useMemo(() => {
        if (activeTab === 'my') {
            return voices.filter(v => v.user_id === userId);
        }
        return voices.filter(v => v.is_public || v.user_id === userId);
    }, [voices, activeTab, userId]);

    // Filter by search query
    const filteredVoices = useMemo(() => {
        return filteredByTab.filter(voice =>
            voice.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [filteredByTab, searchQuery]);

    const handleSelect = (voiceId: string) => {
        const voice = voices.find(v => v.voice_sample_id === voiceId);
        if (voice) {
            onSelect(voice);
            onBack();
        }
    };

    const handleUploadSuccess = (voice: VoiceSample) => {
        addVoice(voice);
        setActiveTab('my');
        setView('library');
    };

    const handleDelete = async (voiceId: string) => {
        try {
            await deleteVoice(voiceId);
        } catch (err: any) {
            alert(err.message || 'Gagal menghapus voice');
        }
    };

    const handlePlay = (audioUrl: string, voiceId: string) => {
        toggleAudio(audioUrl, voiceId);
    };

    if (view === 'upload') {
        return (
            <VoiceUploadForm
                userId={userId || ''}
                onCancel={() => setView('library')}
                onSuccess={handleUploadSuccess}
            />
        );
    }

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
                    <p className="text-sm text-gray-500">Choose a voice to get started</p>
                </div>
            </div>

            {/* Tabs & Search - Same Row */}
            <div className="px-6 pt-4 pb-2 bg-white shrink-0 border-b border-gray-100">
                <div className="flex items-center gap-4 mb-3">
                    {/* Tabs */}
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`
                                px-4 py-2 text-sm font-semibold rounded-md transition-all
                                ${activeTab === 'all'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }
                            `}
                        >
                            All Voices
                        </button>
                        <button
                            onClick={() => setActiveTab('my')}
                            className={`
                                px-4 py-2 text-sm font-semibold rounded-md transition-all
                                ${activeTab === 'my'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }
                            `}
                        >
                            My Voices
                        </button>
                    </div>

                    {/* Search */}
                    <div className="flex-1">
                        <VoiceLibraryFilters
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            showGenderFilter={false}
                            showLanguageFilter={false}
                        />
                    </div>
                </div>
            </div>

            {/* Voice Grid */}
            <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50/50 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                {/* Loading State */}
                {isLoading && filteredVoices.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-sm text-gray-500">Loading voices...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {/* Add New Voice Card - Only in My Voices tab */}
                        {activeTab === 'my' && (
                            <button
                                onClick={() => setView('upload')}
                                className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center gap-3 group min-h-[140px]"
                            >
                                <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                    <Plus className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                </div>
                                <span className="text-sm font-semibold text-gray-600 group-hover:text-blue-600 transition-colors">
                                    Add New Voice
                                </span>
                            </button>
                        )}

                        {/* Voice Cards */}
                        {filteredVoices.map(voice => (
                            <VoiceCard
                                key={voice.voice_sample_id}
                                id={voice.voice_sample_id}
                                name={voice.name}
                                language={voice.description}
                                isSelected={selectedId === voice.voice_sample_id}
                                onSelect={handleSelect}
                                accentColor="blue"
                                audioUrl={voice.audio_url}
                                onPlay={handlePlay}
                                isPlaying={playingId === voice.voice_sample_id}
                                onDelete={activeTab === 'my' ? handleDelete : undefined}
                                showDelete={activeTab === 'my'}
                            />
                        ))}

                        {/* Empty State - No search results (only for All Voices or when searching in My Voices) */}
                        {!isLoading && filteredVoices.length === 0 && (activeTab === 'all' || (activeTab === 'my' && searchQuery !== '')) && (
                            <div className="col-span-2 flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Plus className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-900 mb-1">No voices found</p>
                                    <p className="text-xs text-gray-500">Try a different search</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
