import React, { useState, useEffect } from 'react';
import { X, Wand2, History } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useScrollLock } from '@/hooks/useScrollLock';

import { TTSGeneratorView } from './TTSGeneratorView';
import { KokoroHistoryContainer } from './kokoro/KokoroHistoryContainer';
import { ChatterboxHistoryContainer } from './chatterbox/ChatterboxHistoryContainer';
import { KokoroVoiceLibraryContainer } from './kokoro/KokoroVoiceLibraryContainer';
import { ChatterboxVoiceLibraryContainer } from './chatterbox/ChatterboxVoiceLibraryContainer';
import { EngineSelector } from './EngineSelector';
import { useChatterboxContext } from '../../context/ChatterboxContext';
import { useKokoroContext } from '../../context/KokoroContext';
import { useAudioPlayer } from '@/features/avatar-generator/hooks/tts/useAudioPlayer';

const TTS_ENGINE_STORAGE_KEY = 'tts_active_engine';

const getStoredEngine = (): 'kokoro' | 'chatterbox' => {
    try {
        const stored = localStorage.getItem(TTS_ENGINE_STORAGE_KEY);
        return (stored === 'kokoro' || stored === 'chatterbox') ? stored : 'kokoro';
    } catch {
        return 'kokoro';
    }
};

const saveEngine = (engine: 'kokoro' | 'chatterbox') => {
    try {
        localStorage.setItem(TTS_ENGINE_STORAGE_KEY, engine);
    } catch (err) {
        console.error('Failed to save engine preference:', err);
    }
};

interface TTSModalProps {
    onClose: () => void;
    onComplete: (file: File) => void;
}

export const TTSModal: React.FC<TTSModalProps> = ({ onClose, onComplete }) => {
    return (
        <TTSModalContent onClose={onClose} onComplete={onComplete} />
    );
};

const TTSModalContent: React.FC<TTSModalProps> = ({ onClose, onComplete }) => {
    useScrollLock(true);
    const { user } = useAuth();
    const userId = user?.id ? String(user.id) : undefined;

    // Contexts
    const chatterbox = useChatterboxContext();
    const kokoro = useKokoroContext();

    // UI State
    const [view, setView] = useState<'generator' | 'library'>('generator');
    const [activeTab, setActiveTab] = useState<'generate' | 'history'>('generate');
    const [activeEngine, setActiveEngine] = useState<'kokoro' | 'chatterbox'>(getStoredEngine());

    // Audio Playback State
    const { playingId, toggle: toggleAudio, stop: stopAudio } = useAudioPlayer();

    useEffect(() => {
        const stored = getStoredEngine();
        setActiveEngine(stored);
    }, []);

    const handleEngineChange = (engine: 'kokoro' | 'chatterbox') => {
        setActiveEngine(engine);
        saveEngine(engine);
        stopAudio();
    };

    useEffect(() => {
        return () => stopAudio();
    }, []);

    const handleClose = () => {
        stopAudio();
        onClose();
    };

    const handleTabChange = (tab: 'generate' | 'history') => {
        stopAudio();
        setActiveTab(tab);
    };

    const handleHistoryPlay = (url: string, projectId?: string) => {
        toggleAudio(url, projectId);
    };

    const handleUseAudio = async (url: string) => {
        stopAudio();
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const filename = `tts_generated_${Date.now()}.wav`;
            const file = new File([blob], filename, { type: 'audio/wav' });
            onComplete(file);
            onClose();
        } catch (err) {
            console.error("Failed to download audio", err);
            alert("Failed to process generated audio");
        }
    };

    // Library Selection Handlers
    const handleChatterboxVoiceSelect = (voice: any) => {
        chatterbox.setSelectedVoice(voice);
        setView('generator');
    };

    const handleKokoroVoiceSelect = (voiceId: string) => {
        const voice = kokoro.voices.find(v => v.id === voiceId);
        if (voice) {
            kokoro.setSelectedVoice(voice);
        }
        setView('generator');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col h-[850px] overflow-hidden border border-gray-100">

                {view === 'library' ? (
                    activeEngine === 'kokoro' ? (
                        <KokoroVoiceLibraryContainer
                            selectedId={kokoro.selectedVoice?.id}
                            onSelect={handleKokoroVoiceSelect}
                            onBack={() => setView('generator')}
                        />
                    ) : (
                        <ChatterboxVoiceLibraryContainer
                            userId={userId}
                            selectedId={chatterbox.selectedVoice?.voice_sample_id}
                            onSelect={handleChatterboxVoiceSelect}
                            onBack={() => setView('generator')}
                        />
                    )
                ) : (
                    <>
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0 z-10">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                        <Wand2 className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">AI Voice Generator</h2>
                                </div>
                                <p className="text-sm text-gray-500 ml-12">Create realistic speech from text in seconds</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <EngineSelector
                                    activeEngine={activeEngine}
                                    onEngineChange={handleEngineChange}
                                />
                                <button
                                    onClick={handleClose}
                                    className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="px-8 border-b border-gray-100 bg-gray-50/50 flex shrink-0">
                            <button
                                onClick={() => handleTabChange('generate')}
                                className={`flex-1 py-4 text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-2 ${activeTab === 'generate'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Wand2 className="w-4 h-4" />
                                Generate
                            </button>
                            <button
                                onClick={() => handleTabChange('history')}
                                className={`flex-1 py-4 text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-2 ${activeTab === 'history'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <History className="w-4 h-4" />
                                History
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-h-0 overflow-hidden relative bg-gray-50/30">
                            {activeTab === 'generate' ? (
                                <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                                    <TTSGeneratorView
                                        activeEngine={activeEngine}
                                        onComplete={onComplete}
                                        onClose={onClose}
                                        onOpenLibrary={() => setView('library')}
                                        onOpenKokoroLibrary={() => setView('library')}
                                    />
                                </div>
                            ) : (
                                <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                                    <div className="p-6 space-y-4">
                                        {activeEngine === 'kokoro' ? (
                                            <KokoroHistoryContainer
                                                onPlay={handleHistoryPlay}
                                                isPlaying={!!playingId} // Convert string|null to boolean
                                                playingProjectId={playingId}
                                                onUseAudio={handleUseAudio}
                                            />
                                        ) : (
                                            <ChatterboxHistoryContainer
                                                userId={userId}
                                                onPlay={handleHistoryPlay}
                                                isPlaying={!!playingId} // Convert string|null to boolean
                                                playingProjectId={playingId}
                                                onUseAudio={handleUseAudio}
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
