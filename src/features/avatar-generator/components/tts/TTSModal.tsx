import React, { useState, useEffect } from 'react';
import { X, Wand2, History, Mic } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useVoiceLibrary } from '../../hooks/tts/useVoiceLibrary';
import { useScrollLock } from '@/hooks/useScrollLock';
import { VoiceSample } from '../../types/domain/chatterbox';
import { KokoroVoice } from '../../types/domain/kokoro';

import { TTSGeneratorView, GeneratorSettings, DEFAULT_GENERATOR_SETTINGS } from './generator/TTSGeneratorView';
import { TTSHistoryView } from './history/TTSHistoryView';
import { KokoroHistoryView } from './history/KokoroHistoryView';
import { VoiceLibraryView } from './library/VoiceLibraryView';
import { KokoroVoiceLibrary } from './generator/KokoroVoiceLibrary';
import { EngineSelector } from './generator/EngineSelector';
import { useKokoro } from '../../hooks/tts/useKokoro';
import { KokoroProvider } from '../../context/KokoroContext';

// localStorage key for engine preference
const TTS_ENGINE_STORAGE_KEY = 'tts_active_engine';

// Helper: Get stored engine preference
const getStoredEngine = (): 'kokoro' | 'chatterbox' => {
    try {
        const stored = localStorage.getItem(TTS_ENGINE_STORAGE_KEY);
        return (stored === 'kokoro' || stored === 'chatterbox') ? stored : 'kokoro';
    } catch {
        return 'kokoro';
    }
};

// Helper: Save engine preference
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
        <KokoroProvider>
            <TTSModalContent onClose={onClose} onComplete={onComplete} />
        </KokoroProvider>
    );
};

const TTSModalContent: React.FC<TTSModalProps> = ({ onClose, onComplete }) => {
    useScrollLock(true);

    const { user } = useAuth();
    const userId = user?.id ? String(user.id) : undefined;

    const voiceLib = useVoiceLibrary(userId);
    const { isLoading: isVoicesLoading } = voiceLib;

    // Kokoro Hook
    const kokoro = useKokoro(userId);

    const [view, setView] = useState<'generator' | 'library' | 'kokoro-library'>('generator');
    const [activeTab, setActiveTab] = useState<'generate' | 'history'>('generate');
    const [selectedVoice, setSelectedVoice] = useState<VoiceSample | null>(null);
    const [generatorMode, setGeneratorMode] = useState<'cloning' | 'multilingual' | 'voice-changer'>('cloning');
    const [sourceFile, setSourceFile] = useState<File | null>(null);
    const [text, setText] = useState(''); // Chatterbox text
    const [settings, setSettings] = useState<GeneratorSettings>(DEFAULT_GENERATOR_SETTINGS);
    const [activeEngine, setActiveEngine] = useState<'kokoro' | 'chatterbox'>(getStoredEngine());

    // Load engine preference on mount
    useEffect(() => {
        const stored = getStoredEngine();
        setActiveEngine(stored);
    }, []);

    // Save engine preference when changed
    const handleEngineChange = (engine: 'kokoro' | 'chatterbox') => {
        setActiveEngine(engine);
        saveEngine(engine);
    };

    // Kokoro State
    const [kokoroText, setKokoroText] = useState(''); // Kokoro text (persistent)
    const [kokoroSpeed, setKokoroSpeed] = useState(1.0); // Kokoro speed (persistent)

    // Kokoro Voice Selection State
    const [selectedKokoroVoice, setSelectedKokoroVoice] = useState<KokoroVoice | null>(null);

    // Audio Preview State for History
    const [isPlaying, setIsPlaying] = useState(false);
    const [playingProjectId, setPlayingProjectId] = useState<string | null>(null);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);

    const stopPlayback = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setIsPlaying(false);
        setPlayingProjectId(null);
    };

    // Cleanup audio on unmount
    React.useEffect(() => {
        return () => stopPlayback();
    }, []);

    const handleClose = () => {
        stopPlayback();
        onClose();
    };

    const handleTabChange = (tab: 'generate' | 'history') => {
        stopPlayback();
        setActiveTab(tab);
    };

    const handleHistoryPlay = (url: string, projectId?: string) => {
        if (isPlaying && (projectId === playingProjectId || (!projectId && !playingProjectId))) {
            audioRef.current?.pause();
            setIsPlaying(false);
            setPlayingProjectId(null);
            return;
        }

        if (audioRef.current) {
            audioRef.current.pause();
        }

        audioRef.current = new Audio(url);
        audioRef.current.onended = () => {
            setIsPlaying(false);
            setPlayingProjectId(null);
        };
        audioRef.current.play();
        setIsPlaying(true);
        if (projectId) setPlayingProjectId(projectId);
        else setPlayingProjectId(null);
    };

    const handleUseAudio = async (url: string) => {
        stopPlayback();
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col h-[850px] overflow-hidden border border-gray-100">

                {view === 'library' ? (
                    <VoiceLibraryView
                        voiceLib={voiceLib}
                        onBack={() => setView('generator')}
                        selectedId={selectedVoice?.voice_sample_id}
                        onSelect={(voice) => {
                            setSelectedVoice(voice);
                            setView('generator');
                        }}
                    />
                ) : view === 'kokoro-library' ? (
                    <KokoroVoiceLibrary
                        voices={kokoro.voices}
                        selectedVoiceId={selectedKokoroVoice?.id || ''}
                        onSelect={(voiceId) => {
                            const voice = kokoro.voices.find(v => v.id === voiceId);
                            if (voice) {
                                setSelectedKokoroVoice(voice);
                            }
                        }}
                        onBack={() => setView('generator')}
                    />
                ) : (
                    <>
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                            <div className="flex items-center gap-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                        <Wand2 className="w-6 h-6 text-blue-600" />
                                        AI Voice Generator
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">Create realistic speech from text in seconds</p>
                                </div>

                                <div className="pl-6 border-l border-gray-200">
                                    <EngineSelector
                                        activeEngine={activeEngine}
                                        onEngineChange={handleEngineChange}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="px-8 pt-2 bg-white shrink-0">
                            <div className="flex border-b border-gray-100">
                                <button
                                    onClick={() => handleTabChange('generate')}
                                    className={`flex-1 pb-4 text-sm font-semibold transition-all relative flex items-center justify-center gap-2 ${activeTab === 'generate' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <Wand2 className="w-4 h-4" />
                                    Generate
                                    {activeTab === 'generate' && (
                                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
                                    )}
                                </button>

                                <button
                                    onClick={() => handleTabChange('history')}
                                    className={`flex-1 pb-4 text-sm font-semibold transition-all relative flex items-center justify-center gap-2 ${activeTab === 'history' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <History className="w-4 h-4" />
                                    History
                                    {activeTab === 'history' && (
                                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-hidden flex flex-col">
                            {activeTab === 'generate' ? (
                                <TTSGeneratorView
                                    userId={userId}
                                    onComplete={onComplete}
                                    onClose={handleClose}
                                    onOpenLibrary={() => setView('library')}
                                    selectedVoice={selectedVoice}
                                    isVoicesLoading={isVoicesLoading}
                                    mode={generatorMode}
                                    onModeChange={setGeneratorMode}
                                    sourceFile={sourceFile}
                                    onSourceFileChange={setSourceFile}
                                    text={text}
                                    onTextChange={setText}
                                    settings={settings}
                                    onSettingsChange={setSettings}
                                    activeEngine={activeEngine}
                                    kokoro={kokoro}
                                    selectedKokoroVoice={selectedKokoroVoice}
                                    onOpenKokoroLibrary={() => setView('kokoro-library')}
                                    kokoroText={kokoroText}
                                    onKokoroTextChange={setKokoroText}
                                    kokoroSpeed={kokoroSpeed}
                                    onKokoroSpeedChange={setKokoroSpeed}
                                />

                            ) : (
                                <div className="flex-1 overflow-y-auto px-8 py-6 bg-gray-50/50">
                                    {activeEngine === 'kokoro' ? (
                                        <KokoroHistoryView
                                            projects={kokoro.projects}
                                            isLoading={kokoro.isHistoryLoading}
                                            onUseAudio={handleUseAudio}
                                            isPlaying={isPlaying}
                                            playingProjectId={playingProjectId}
                                            onPlay={handleHistoryPlay}
                                            onDelete={kokoro.deleteProject}
                                        />
                                    ) : (
                                        <TTSHistoryView
                                            userId={userId}
                                            onUseAudio={handleUseAudio}
                                            isPlaying={isPlaying}
                                            playingProjectId={playingProjectId}
                                            onPlay={handleHistoryPlay}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
