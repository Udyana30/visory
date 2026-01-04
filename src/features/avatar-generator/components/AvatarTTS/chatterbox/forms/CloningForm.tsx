import React from 'react';
import { VoiceSample } from '../../../../types/domain/chatterbox';
import { VoiceSelector } from '../../shared/VoiceSelector';

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
            selectedVoiceName={selectedVoice?.name}
            selectedVoiceId={selectedVoice?.voice_sample_id}
            onOpenLibrary={onOpenLibrary}
            isLoading={isVoicesLoading}
            accentColor="blue"
            emptyStateText="Select a voice from library"
            emptyStateSubtext="Choose from your cloned voices"
            label="Voice Selection"
        />
    );
};
