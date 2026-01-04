import { useState, useRef } from 'react';
import { useVoiceRecorder } from './useVoiceRecorder';

interface UseAudioInputProps {
    file1: File | null;
    file2: File | null;
    onSetFile1: (file: File) => void;
    onSetFile2: (file: File) => void;
    disabled?: boolean;
}

export const useAudioInput = ({
    file1,
    file2,
    onSetFile1,
    onSetFile2,
    disabled
}: UseAudioInputProps) => {
    const inputRef1 = useRef<HTMLInputElement>(null);
    const inputRef2 = useRef<HTMLInputElement>(null);
    const [showTTS, setShowTTS] = useState(false);
    const [targetSlot, setTargetSlot] = useState<1 | 2>(1);
    const [recordingSlot, setRecordingSlot] = useState<1 | 2 | null>(null);
    const [dragOver, setDragOver] = useState<1 | 2 | null>(null);
    const [hoveredButton, setHoveredButton] = useState<'upload' | 'record' | 'generate' | null>(null);

    const recorder = useVoiceRecorder();

    // TTS Handlers
    const handleTTSComplete = (file: File) => {
        if (targetSlot === 1) {
            onSetFile1(file);
        } else {
            onSetFile2(file);
        }
    };

    const openTTS = (slot: 1 | 2) => {
        setTargetSlot(slot);
        setShowTTS(true);
    };

    const closeTTS = () => setShowTTS(false);

    // Recording Handlers
    const handleStartRecording = async (slot: 1 | 2) => {
        setRecordingSlot(slot);
        await recorder.startRecording();
    };

    const handleStopRecording = async () => {
        const file = await recorder.stopRecording();
        if (file && recordingSlot) {
            if (recordingSlot === 1) {
                onSetFile1(file);
            } else {
                onSetFile2(file);
            }
        }
        setRecordingSlot(null);
    };

    const handleCancelRecording = () => {
        recorder.cancelRecording();
        setRecordingSlot(null);
    };

    // Drag and Drop Handlers
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled && !file1 && !file2) {
            setDragOver(1);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(null);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(null);

        if (disabled) return;

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('audio/')) {
            onSetFile1(file);
        }
    };

    // Upload Handlers
    const handleUploadClick = (slot: 1 | 2) => {
        if (slot === 1) {
            inputRef1.current?.click();
        } else {
            inputRef2.current?.click();
        }
    };

    // Hover Handlers
    const setHovered = (button: 'upload' | 'record' | 'generate' | null) => {
        setHoveredButton(button);
    };

    // Dynamic background for outer container
    const getContainerBackgroundClass = () => {
        if (recordingSlot) return 'border-gray-200 bg-gray-50/50';
        if (dragOver) return 'border-blue-400 bg-blue-50/30';
        if (hoveredButton === 'upload') return 'border-blue-400 bg-blue-50/30';
        if (hoveredButton === 'record') return 'border-red-400 bg-red-50/30';
        if (hoveredButton === 'generate') return 'border-purple-400 bg-purple-50/30';
        return 'border-gray-200 bg-gray-50/50';
    };

    return {
        // Refs
        inputRef1,
        inputRef2,

        // State
        showTTS,
        targetSlot,
        recordingSlot,
        dragOver,
        hoveredButton,

        // Recorder
        recorder,

        // TTS Handlers
        handleTTSComplete,
        openTTS,
        closeTTS,

        // Recording Handlers
        handleStartRecording,
        handleStopRecording,
        handleCancelRecording,

        // Drag & Drop Handlers
        handleDragOver,
        handleDragLeave,
        handleDrop,

        // Upload Handlers
        handleUploadClick,

        // Hover Handlers
        setHovered,

        // Helpers
        getContainerBackgroundClass
    };
};
