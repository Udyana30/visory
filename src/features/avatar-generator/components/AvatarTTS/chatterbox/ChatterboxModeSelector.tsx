import React from 'react';
import { Users, Globe, Mic2 } from 'lucide-react';

interface ChatterboxModeSelectorProps {
    mode: 'cloning' | 'multilingual' | 'voice-changer';
    onModeChange: (mode: 'cloning' | 'multilingual' | 'voice-changer') => void;
}

export const ChatterboxModeSelector: React.FC<ChatterboxModeSelectorProps> = ({
    mode,
    onModeChange
}) => {
    return (
        <div className="grid grid-cols-3 gap-1 p-1 bg-gray-200/50 rounded-xl w-full">
            <button
                onClick={() => onModeChange('cloning')}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${mode === 'cloning'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                    }`}
            >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Voice Cloning</span>
                <span className="sm:hidden">Cloning</span>
            </button>
            <button
                onClick={() => onModeChange('multilingual')}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${mode === 'multilingual'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                    }`}
            >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">Multilingual</span>
                <span className="sm:hidden">Multi</span>
            </button>
            <button
                onClick={() => onModeChange('voice-changer')}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${mode === 'voice-changer'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                    }`}
            >
                <Mic2 className="w-4 h-4" />
                <span className="hidden sm:inline">Voice Changer</span>
                <span className="sm:hidden">Changer</span>
            </button>
        </div>
    );
};
