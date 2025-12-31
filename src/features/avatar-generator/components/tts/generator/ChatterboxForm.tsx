import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Wand2, Mic, Globe, Shuffle, Check, RotateCcw } from 'lucide-react';
import { useTTSGenerator } from '../../../hooks/tts/useTTSGenerator';
import { VoiceSample } from '../../../types/domain/chatterbox';
import { CloningForm } from './CloningForm';
import { MultilingualForm } from './MultilingualForm';
import { AdvancedSettings } from './AdvancedSettings';
import { GenerationResult } from './GenerationResult';
import { VoiceChangerForm } from './VoiceChangerForm';
export interface GeneratorSettings {
    temperature: number;
    exaggeration: number;
    cfgWeight: number | '';
    repetitionPenalty: number | '';
    minP: number | '';
    topP: number | '';
    selectedLang: string;
}

export const DEFAULT_GENERATOR_SETTINGS: GeneratorSettings = {
    temperature: 0.7,
    exaggeration: 0.5,
    cfgWeight: 0.5,
    repetitionPenalty: 1.2,
    minP: 0.05,
    topP: 1.0,
    selectedLang: 'en'
};

interface ChatterboxFormProps {
    userId?: string;
    onComplete: (file: File) => void;
    onOpenLibrary: () => void;
    selectedVoice: VoiceSample | null;
    isVoicesLoading: boolean;
    mode: 'cloning' | 'multilingual' | 'voice-changer';
    onModeChange: (mode: 'cloning' | 'multilingual' | 'voice-changer') => void;
    sourceFile: File | null;
    onSourceFileChange: (file: File | null) => void;
    text: string;
    onTextChange: (text: string) => void;
    settings: GeneratorSettings;
    onSettingsChange: (settings: GeneratorSettings) => void;
}

export const ChatterboxForm: React.FC<ChatterboxFormProps> = ({
    userId,
    onComplete,
    onOpenLibrary,
    selectedVoice,
    isVoicesLoading,
    mode,
    onModeChange,
    sourceFile,
    onSourceFileChange,
    text,
    onTextChange,
    settings,
    onSettingsChange
}) => {
    const {
        project,
        isGenerating,
        error,
        languages,
        generateCloning,
        generateMultilingual,
        convertVoice,
        reset
    } = useTTSGenerator(userId);

    // Helper setters for settings
    const updateSetting = <K extends keyof GeneratorSettings>(key: K, value: GeneratorSettings[K]) => {
        onSettingsChange({ ...settings, [key]: value });
    };

    // Audio Preview
    const [isPlaying, setIsPlaying] = useState(false);
    const [playingProjectId, setPlayingProjectId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const handleGenerate = () => {
        if (mode === 'voice-changer') {
            if (!sourceFile) return alert("Please upload a source audio file");
            if (!selectedVoice) return alert("Please select a target voice");

            convertVoice({
                source_audio: sourceFile,
                target_voice_sample_id: selectedVoice.voice_sample_id
            });
            return;
        }

        if (!text) return;

        if (mode === 'cloning') {
            if (!selectedVoice) return alert("Please select a voice sample");

            const payload: any = {
                text,
                voice_sample_id: selectedVoice.voice_sample_id,
                temperature: settings.temperature,
                exaggeration: settings.exaggeration,
                language_id: null,
            };

            if (typeof settings.cfgWeight === 'number') payload.cfg_weight = settings.cfgWeight;
            if (typeof settings.repetitionPenalty === 'number') payload.repetition_penalty = settings.repetitionPenalty;
            if (typeof settings.minP === 'number') payload.min_p = settings.minP;
            if (typeof settings.topP === 'number') payload.top_p = settings.topP;

            generateCloning(payload);
        } else {
            generateMultilingual({
                text,
                language_id: settings.selectedLang,
                temperature: settings.temperature,
                exaggeration: settings.exaggeration
            });
        }
    };

    const handleUseAudio = async (url: string) => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const filename = `tts_generated_${Date.now()}.wav`;
            const file = new File([blob], filename, { type: 'audio/wav' });
            onComplete(file);
        } catch (err) {
            console.error("Failed to download audio", err);
            alert("Failed to process generated audio");
        }
    };

    const togglePlay = (url: string) => {
        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
            return;
        }

        if (audioRef.current) {
            audioRef.current.pause();
        }

        audioRef.current = new Audio(url);
        audioRef.current.onended = () => setIsPlaying(false);
        audioRef.current.play();
        setIsPlaying(true);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Scrollable Content */}
            <div
                className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
                style={{ scrollbarGutter: 'stable' }}
            >
                {/* Mode Selector */}
                <div className="grid grid-cols-3 gap-1 p-1 bg-gray-200/50 rounded-xl w-full">
                    <button
                        onClick={() => onModeChange('cloning')}
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${mode === 'cloning'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                            }`}
                    >
                        <Mic className="w-4 h-4" />
                        <span className="hidden sm:inline">Voice Cloning</span>
                        <span className="sm:hidden">Cloning</span>
                    </button>
                    <button
                        onClick={() => onModeChange('multilingual')}
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${mode === 'multilingual'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                            }`}
                    >
                        <Globe className="w-4 h-4" />
                        <span className="hidden sm:inline">Multilingual</span>
                        <span className="sm:hidden">Multi</span>
                    </button>
                    <button
                        onClick={() => onModeChange('voice-changer')}
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${mode === 'voice-changer'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                            }`}
                    >
                        <Wand2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Voice Changer</span>
                        <span className="sm:hidden">Changer</span>
                    </button>
                </div>

                {/* Text Input - Moved to Top */}
                {mode !== 'voice-changer' && (
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-900 ml-1">Script</label>
                        <div className="relative group">
                            <textarea
                                value={text}
                                onChange={(e) => onTextChange(e.target.value)}
                                placeholder={mode === 'cloning' ? "Type something for the voice to say..." : "Enter text to translate and speak..."}
                                className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-sm leading-relaxed text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none min-h-[140px] transition-all hover:border-gray-300"
                            />
                            <div className="absolute bottom-4 right-4 text-xs font-medium text-gray-400 bg-white px-2 py-1 rounded-md border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                {text.length} chars
                            </div>
                        </div>
                    </div>
                )}

                {/* Forms */}
                <div className="space-y-6">
                    {mode === 'cloning' ? (
                        <CloningForm
                            selectedVoice={selectedVoice}
                            onOpenLibrary={onOpenLibrary}
                            isVoicesLoading={isVoicesLoading}
                        />
                    ) : mode === 'voice-changer' ? (
                        <>
                            <VoiceChangerForm
                                selectedFile={sourceFile}
                                onFileChange={onSourceFileChange}
                            />
                            <CloningForm
                                selectedVoice={selectedVoice}
                                onOpenLibrary={onOpenLibrary}
                                isVoicesLoading={isVoicesLoading}
                            />
                        </>
                    ) : (
                        <MultilingualForm
                            languages={languages}
                            selectedLang={settings.selectedLang}
                            setSelectedLang={(val) => updateSetting('selectedLang', val)}
                        />
                    )}

                    <AdvancedSettings
                        temperature={settings.temperature}
                        setTemperature={(v) => updateSetting('temperature', v)}
                        exaggeration={settings.exaggeration}
                        setExaggeration={(v) => updateSetting('exaggeration', v)}
                        cfgWeight={settings.cfgWeight}
                        setCfgWeight={(v) => updateSetting('cfgWeight', v)}
                        repetitionPenalty={settings.repetitionPenalty}
                        setRepetitionPenalty={(v) => updateSetting('repetitionPenalty', v)}
                        minP={settings.minP}
                        setMinP={(v) => updateSetting('minP', v)}
                        topP={settings.topP}
                        setTopP={(v) => updateSetting('topP', v)}
                        mode={mode}
                    />
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100 flex items-start gap-3 animate-in fade-in">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 shrink-0" />
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                {project && (
                    <GenerationResult
                        project={project}
                        isPlaying={isPlaying}
                        playingProjectId={null}
                        onPlay={togglePlay}
                    />
                )}
            </div>

            {/* Sticky Footer Action Buttons */}
            <div className="p-4 md:p-6 border-t border-gray-100 bg-white shrink-0 flex justify-end gap-2 z-10">
                {project?.status === 'completed' ? (
                    <>
                        <button
                            onClick={() => handleUseAudio(project.audio_url!)}
                            className="flex-1 md:flex-initial md:px-8 py-3 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-95"
                        >
                            <Check className="w-4 h-4" />
                            Use Audio
                        </button>
                        <button
                            onClick={reset}
                            className="px-4 py-3 bg-white text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all border border-gray-200 hover:border-gray-300 flex items-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Again
                        </button>
                    </>
                ) : (
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || (mode !== 'voice-changer' && !text) || ((mode === 'cloning' || mode === 'voice-changer') && !selectedVoice) || (mode === 'voice-changer' && !sourceFile)}
                        className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-4 h-4" />
                                {mode === 'voice-changer' ? 'Convert Voice' : 'Generate Speech'}
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};
