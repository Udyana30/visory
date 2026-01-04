import React from 'react';
import { useChatterboxContext } from '../../../context/ChatterboxContext';
import { ChatterboxGeneratorForm } from './ChatterboxGeneratorForm';
import { useAuth } from '@/hooks/useAuth';

interface ChatterboxGeneratorContainerProps {
    onComplete: (file: File) => void;
    onClose: () => void;
    onOpenLibrary: () => void;
}

export const ChatterboxGeneratorContainer: React.FC<ChatterboxGeneratorContainerProps> = ({
    onComplete,
    onClose,
    onOpenLibrary
}) => {
    const { user } = useAuth();
    const userId = user?.id ? String(user.id) : undefined;

    const {
        // Form State
        mode,
        setMode,
        text,
        setText,
        selectedVoice,
        sourceFile,
        setSourceFile,
        settings,
        setSettings,

        // Generation State
        currentProject,
        isGenerating,
        generationError,
        generateCloning,
        generateMultilingual,
        convertVoice,
        resetGeneration,

        // Data
        languages,
        isLoading: isHistoryLoading // Reusing loading state if needed, or separate
    } = useChatterboxContext();

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
                language_id: null
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
        <ChatterboxGeneratorForm
            mode={mode}
            onModeChange={setMode}
            languages={languages}
            isGenerating={isGenerating}
            project={currentProject}
            error={generationError}
            onGenerate={handleGenerate}
            onUseAudio={handleUseAudio}
            onReset={resetGeneration}
            selectedVoice={selectedVoice}
            onOpenLibrary={onOpenLibrary}
            isVoicesLoading={false} // Voices loading is handled in library, not here usually
            sourceFile={sourceFile}
            onSourceFileChange={setSourceFile}
            text={text}
            onTextChange={setText}
            settings={settings}
            onSettingsChange={setSettings}
        />
    );
};
