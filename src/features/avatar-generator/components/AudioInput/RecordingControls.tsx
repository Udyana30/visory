import React from 'react';
import { Circle, Square } from 'lucide-react';

interface RecordingControlsProps {
    recordingTime: number;
    onStop: () => void;
    onCancel: () => void;
}

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const RecordingControls: React.FC<RecordingControlsProps> = ({
    recordingTime,
    onStop,
    onCancel
}) => {
    return (
        <div className="w-full p-4 rounded-lg border-2 border-red-400 bg-red-50/50 transition-all">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Circle className="w-3 h-3 text-red-600 fill-red-600 animate-pulse" />
                    <span className="text-sm font-semibold text-red-700">Recording...</span>
                </div>
                <span className="text-sm font-mono font-bold text-red-700">
                    {formatTime(recordingTime)}
                </span>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={onStop}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-all"
                >
                    <Square className="w-4 h-4" />
                    Stop
                </button>
                <button
                    onClick={onCancel}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm transition-all"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};
