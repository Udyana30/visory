import React from 'react';
import { Volume2, Loader2, Mic } from 'lucide-react';
import { VoiceSample } from '../../../types/domain/chatterbox';

interface VoiceSelectorProps {
    selectedVoice: VoiceSample | null;
    onOpenLibrary: () => void;
    isLoading?: boolean;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({ selectedVoice, onOpenLibrary, isLoading }) => {
    return (
        <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900 ml-1">Voice Selection</label>
            {selectedVoice ? (
                <div className="group flex items-center justify-between p-4 bg-white border border-blue-100 rounded-2xl shadow-sm hover:border-blue-200 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                            <Volume2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-base font-bold text-gray-900">{selectedVoice.name}</p>
                            <p className="text-xs text-gray-500 font-medium tracking-wide">ID: {selectedVoice.voice_sample_id.slice(0, 8)}...</p>
                        </div>
                    </div>
                    <button
                        onClick={onOpenLibrary}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 px-4 py-2 hover:bg-blue-50 rounded-xl transition-colors"
                    >
                        Change Voice
                    </button>
                </div>
            ) : (
                <button
                    onClick={onOpenLibrary}
                    className="w-full p-8 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-gray-500 hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-300 group"
                >
                    <div className="w-12 h-12 bg-gray-50 group-hover:bg-blue-100 text-gray-400 group-hover:text-blue-600 rounded-full flex items-center justify-center transition-colors">
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5" />}
                    </div>
                    <div className="text-center">
                        <span className="block font-semibold text-gray-700 group-hover:text-blue-700">Select a voice from library</span>
                        <span className="text-xs text-gray-400 mt-1">Choose from your cloned voices</span>
                    </div>
                </button>
            )}
        </div>
    );
};
