import React from 'react';
import { Volume2, Loader2, Sparkles } from 'lucide-react';
import { KokoroVoice } from '../../../types/domain/kokoro';

interface KokoroVoiceSelectorProps {
    selectedVoice: KokoroVoice | null;
    onOpenLibrary: () => void;
    isLoading?: boolean;
}

export const KokoroVoiceSelector: React.FC<KokoroVoiceSelectorProps> = ({
    selectedVoice,
    onOpenLibrary,
    isLoading
}) => {
    return (
        <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900 ml-1">Voice Model</label>
            {selectedVoice ? (
                <div className="group flex items-center justify-between p-4 bg-white border border-indigo-100 rounded-2xl shadow-sm hover:border-indigo-200 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                            <Volume2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-base font-bold text-gray-900">{selectedVoice.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-medium text-gray-500 capitalize bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                                    {selectedVoice.gender}
                                </span>
                                <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                                    {selectedVoice.language}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onOpenLibrary}
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 px-4 py-2 hover:bg-indigo-50 rounded-xl transition-colors"
                    >
                        Change Voice
                    </button>
                </div>
            ) : (
                <button
                    onClick={onOpenLibrary}
                    className="w-full p-8 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-gray-500 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-300 group"
                >
                    <div className="w-12 h-12 bg-gray-50 group-hover:bg-indigo-100 text-gray-400 group-hover:text-indigo-600 rounded-full flex items-center justify-center transition-colors">
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    </div>
                    <div className="text-center">
                        <span className="block font-semibold text-gray-700 group-hover:text-indigo-700">Select a voice from library</span>
                        <span className="text-xs text-gray-400 mt-1">Choose from Kokoro AI voices</span>
                    </div>
                </button>
            )}
        </div>
    );
};
