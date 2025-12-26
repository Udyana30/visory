import React from 'react';
import { VoiceSample } from '../../../types/domain/chatterbox';
import { VoiceSelector } from '../shared/VoiceSelector';

interface CloningFormProps {
    selectedVoice: VoiceSample | null;
    onOpenLibrary: () => void;
    isVoicesLoading: boolean;
}

export const CloningForm: React.FC<CloningFormProps> = ({
    selectedVoice,
    onOpenLibrary,
    isVoicesLoading
}) => {
    return (
        <VoiceSelector
            selectedVoice={selectedVoice}
            onOpenLibrary={onOpenLibrary}
            isLoading={isVoicesLoading}
        />
    );
};
