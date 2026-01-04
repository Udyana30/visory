import React from 'react';
import { X, FileAudio } from 'lucide-react';

interface AudioItemProps {
    file: File;
    onClear: () => void;
    label: string;
    isActive?: boolean;
    disabled?: boolean;
}

export const AudioItem: React.FC<AudioItemProps> = ({
    file,
    onClear,
    label,
    isActive = true,
    disabled = false
}) => {
    return (
        <div className={`relative flex items-center gap-3 p-3 rounded-lg border transition-all ${isActive
                ? 'bg-white border-blue-200 shadow-sm'
                : 'bg-white/50 border-gray-100 hover:border-blue-200'
            }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isActive ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
                }`}>
                <FileAudio className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">{file.name}</p>
                <p className="text-[10px] text-gray-500 font-medium">{label}</p>
            </div>
            <button
                onClick={onClear}
                disabled={disabled}
                className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-md transition-colors"
            >
                <X className="w-3.5 h-3.5" />
            </button>
        </div>
    );
};
