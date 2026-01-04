import React from 'react';
import { Loader2, Wand2 } from 'lucide-react';
import { TTSProject, VoiceSample, SupportedLanguages } from '../../../types/domain/chatterbox';
import { ChatterboxModeSelector } from './ChatterboxModeSelector';
import { CloningForm } from './forms/CloningForm';
import { MultilingualForm } from './forms/MultilingualForm';
import { VoiceChangerForm } from './forms/VoiceChangerForm';
import { ChatterboxAdvancedSettings } from './forms/AdvancedSettings';
import { GenerationResult } from '../shared/GenerationResult';

export interface GeneratorSettings {
    temperature: number;
    exaggeration: number;
    cfgWeight: number | '';
    repetitionPenalty: number | '';
    minP: number | '';
    topP: number | '';
    selectedLang: string;
}

interface ChatterboxGeneratorFormProps {
    mode: 'cloning' | 'multilingual' | 'voice-changer';
    onModeChange: (mode: 'cloning' | 'multilingual' | 'voice-changer') => void;
    languages: SupportedLanguages;
    isGenerating: boolean;
    project: TTSProject | null;
    error: string | null;
    onGenerate: () => void;
    onUseAudio: (url: string) => void;
    onReset: () => void;
    selectedVoice: VoiceSample | null;
    onOpenLibrary: () => void;
    isVoicesLoading: boolean;
    sourceFile: File | null;
    onSourceFileChange: (file: File | null) => void;
    text: string;
    onTextChange: (text: string) => void;
    settings: GeneratorSettings;
    onSettingsChange: (settings: GeneratorSettings) => void;
}

export const ChatterboxGeneratorForm: React.FC<ChatterboxGeneratorFormProps> = ({
    mode,
    onModeChange,
    languages,
    isGenerating,
    project,
    error,
    onGenerate,
    onUseAudio,
    onReset,
    selectedVoice,
    onOpenLibrary,
    isVoicesLoading,
    sourceFile,
    onSourceFileChange,
    text,
    onTextChange,
    settings,
    onSettingsChange
}) => {
    const updateSetting = <K extends keyof GeneratorSettings>(key: K, value: GeneratorSettings[K]) => {
        onSettingsChange({ ...settings, [key]: value });
    };

    const handleUseAudio = async () => {
        if (!project?.audio_url) return;
        await onUseAudio(project.audio_url);
    };

    return (
        <div className="flex flex-col h-full">
            <div
                className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
                style={{ scrollbarGutter: 'stable' }}
            >
                <ChatterboxModeSelector mode={mode} onModeChange={onModeChange} />

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

                <div className="space-y-6">
                    {mode === 'cloning' ? (
                        <CloningForm
                            selectedVoice={selectedVoice}
                            onOpenLibrary={onOpenLibrary}
                            isVoicesLoading={isVoicesLoading}
                        />
                    ) : mode === 'voice-changer' ? (
                        <VoiceChangerForm
                            selectedFile={sourceFile}
                            onFileChange={onSourceFileChange}
                            selectedVoice={selectedVoice}
                            onOpenLibrary={onOpenLibrary}
                            isVoicesLoading={isVoicesLoading}
                        />
                    ) : (
                        <MultilingualForm
                            languages={languages}
                            selectedLang={settings.selectedLang}
                            setSelectedLang={(val) => updateSetting('selectedLang', val)}
                        />
                    )}

                    <ChatterboxAdvancedSettings
                        temperature={settings.temperature}
                        setTemperature={(v: number) => updateSetting('temperature', v)}
                        exaggeration={settings.exaggeration}
                        setExaggeration={(v: number) => updateSetting('exaggeration', v)}
                        cfgWeight={settings.cfgWeight}
                        setCfgWeight={(v: number) => updateSetting('cfgWeight', v)}
                        repetitionPenalty={settings.repetitionPenalty}
                        setRepetitionPenalty={(v: number) => updateSetting('repetitionPenalty', v)}
                        minP={settings.minP}
                        setMinP={(v: number | '') => updateSetting('minP', v)}
                        topP={settings.topP}
                        setTopP={(v: number | '') => updateSetting('topP', v)}
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
                        audioUrl={project.audio_url || null}
                        status={project.status === 'completed' ? 'completed' : project.status === 'failed' ? 'error' : 'generating'}
                        onUse={handleUseAudio}
                        onRegenerate={onReset}
                        accentColor="blue"
                    />
                )}
            </div>

            {!project?.audio_url && (
                <div className="p-4 md:p-6 border-t border-gray-100 bg-white shrink-0 flex justify-end gap-2 z-10">
                    <button
                        onClick={onGenerate}
                        disabled={isGenerating || (mode !== 'voice-changer' && !text) || ((mode === 'cloning' || mode === 'voice-changer') && !selectedVoice) || (mode === 'voice-changer' && !sourceFile)}
                        className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Generating...</span>
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-4 h-4" />
                                <span>{mode === 'voice-changer' ? 'Convert Voice' : 'Generate Speech'}</span>
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};
