import React from 'react';
import { VoiceSample } from '../../../types/domain/chatterbox';
import { KokoroVoice } from '../../../types/domain/kokoro';
import { KokoroForm } from './KokoroForm';
import { ChatterboxForm, GeneratorSettings, DEFAULT_GENERATOR_SETTINGS } from './ChatterboxForm';
import { useKokoro } from '../../../hooks/tts/useKokoro';

// Re-export types needed by parent
export type { GeneratorSettings };
export { DEFAULT_GENERATOR_SETTINGS };

interface TTSGeneratorViewProps {
    userId?: string;
    onComplete: (file: File) => void;
    onClose: () => void;
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
    activeEngine: 'kokoro' | 'chatterbox';
    // Kokoro Props
    kokoro: ReturnType<typeof useKokoro>;
    selectedKokoroVoice: KokoroVoice | null;
    onOpenKokoroLibrary: () => void;
    kokoroText: string;
    onKokoroTextChange: (text: string) => void;
    kokoroSpeed: number;
    onKokoroSpeedChange: (speed: number) => void;
}

export const TTSGeneratorView: React.FC<TTSGeneratorViewProps> = (props) => {
    const { activeEngine, kokoro } = props;

    const handleKokoroComplete = (file: File) => {
        props.onComplete(file);
        props.onClose();
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col min-h-0 bg-gray-50/50">
                {/* Conditional Rendering based on Active Engine */}
                {activeEngine === 'kokoro' ? (
                    <KokoroForm
                        isVoicesLoading={kokoro.isVoicesLoading}
                        isGenerating={kokoro.isGenerating}
                        status={kokoro.status}
                        lastGeneratedAudioUrl={kokoro.lastGeneratedAudioUrl}
                        onGenerate={(text, voice, speed) => kokoro.generateAudio(text, voice, speed)}
                        selectedVoice={props.selectedKokoroVoice}
                        onOpenLibrary={props.onOpenKokoroLibrary}
                        onComplete={handleKokoroComplete}
                        downloadAudio={kokoro.downloadAudio}
                        resetGeneration={kokoro.resetGeneration}
                        text={props.kokoroText}
                        onTextChange={props.onKokoroTextChange}
                        speed={props.kokoroSpeed}
                        onSpeedChange={props.onKokoroSpeedChange}
                    />
                ) : (
                    <ChatterboxForm
                        {...props}
                    />
                )}
            </div>
        </div>
    );
};
