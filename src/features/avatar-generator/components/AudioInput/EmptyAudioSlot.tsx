import React from 'react';
import { Mic, Circle, Wand2 } from 'lucide-react';
import { ActionButton } from '../shared/ActionButton';
import { RecordingControls } from './RecordingControls';

interface EmptyAudioSlotProps {
    onUpload: () => void;
    onRecord: () => void;
    onTTS: () => void;
    onHover: (button: 'upload' | 'record' | 'generate' | null) => void;
    label: string;
    slot: 1 | 2;
    isRecording: boolean;
    recordingTime: number;
    onStopRecording: () => void;
    onCancelRecording: () => void;
    disabled?: boolean;
}

export const EmptyAudioSlot: React.FC<EmptyAudioSlotProps> = ({
    onUpload,
    onRecord,
    onTTS,
    onHover,
    label,
    isRecording,
    recordingTime,
    onStopRecording,
    onCancelRecording,
    disabled = false
}) => {
    if (isRecording) {
        return (
            <RecordingControls
                recordingTime={recordingTime}
                onStop={onStopRecording}
                onCancel={onCancelRecording}
            />
        );
    }

    return (
        <div className="w-full p-3 rounded-lg border border-gray-200 bg-white/50 transition-all">
            <div className="text-center mb-2.5">
                <p className="text-xs font-semibold text-gray-700">{label}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Choose an option</p>
            </div>
            <div className="flex flex-col gap-1.5">
                <ActionButton
                    icon={<Mic className="w-3.5 h-3.5" />}
                    label="Upload"
                    onClick={onUpload}
                    onMouseEnter={() => onHover('upload')}
                    onMouseLeave={() => onHover(null)}
                    disabled={disabled}
                    variant="blue"
                    size="sm"
                />
                <ActionButton
                    icon={<Circle className="w-3.5 h-3.5" />}
                    label="Record"
                    onClick={onRecord}
                    onMouseEnter={() => onHover('record')}
                    onMouseLeave={() => onHover(null)}
                    disabled={disabled}
                    variant="red"
                    size="sm"
                />
                <ActionButton
                    icon={<Wand2 className="w-3.5 h-3.5" />}
                    label="Generate"
                    onClick={onTTS}
                    onMouseEnter={() => onHover('generate')}
                    onMouseLeave={() => onHover(null)}
                    disabled={disabled}
                    variant="purple"
                    size="sm"
                />
            </div>
        </div>
    );
};
