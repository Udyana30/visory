import React from 'react';
import { useKokoro } from '../../../hooks/tts/useKokoro';
import { KokoroGeneratorForm } from './KokoroGeneratorForm';

interface KokoroGeneratorContainerProps {
    onComplete: (file: File) => void;
    onClose: () => void;
    onOpenLibrary: () => void;
}

export const KokoroGeneratorContainer: React.FC<KokoroGeneratorContainerProps> = ({
    onComplete,
    onClose,
    onOpenLibrary
}) => {
    const kokoro = useKokoro();

    const handleGenerate = (text: string, voice: string, speed: number) => {
        kokoro.generateAudio(text, voice, speed);
    };

    const handleUseAudio = async (url: string) => {
        try {
            const file = await kokoro.downloadAudio(url);
            onComplete(file);
            onClose();
        } catch (error) {
            console.error('Failed to download audio:', error);
            alert('Failed to download audio');
        }
    };

    return (
        <KokoroGeneratorForm
            isVoicesLoading={kokoro.isVoicesLoading}
            isGenerating={kokoro.isGenerating}
            status={kokoro.status}
            lastGeneratedAudioUrl={kokoro.lastGeneratedAudioUrl}
            onGenerate={handleGenerate}
            selectedVoice={kokoro.selectedVoice}
            onOpenLibrary={onOpenLibrary}
            onUseAudio={handleUseAudio}
            onReset={kokoro.resetGeneration}
            text={kokoro.text}
            onTextChange={kokoro.setText}
            speed={kokoro.speed}
            onSpeedChange={kokoro.setSpeed}
        />
    );
};
