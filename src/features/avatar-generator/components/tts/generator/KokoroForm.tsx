import React, { useState } from 'react';
import { Loader2, Sparkles, Wand2, Check, RotateCcw } from 'lucide-react';
import { KokoroVoice } from '../../../types/domain/kokoro';
import { KokoroVoiceSelector } from './KokoroVoiceSelector';

interface KokoroFormProps {
    isVoicesLoading: boolean;
    isGenerating: boolean;
    status: string;
    lastGeneratedAudioUrl: string | null;
    onGenerate: (text: string, voice: string, speed: number) => void;
    selectedVoice: KokoroVoice | null;
    onOpenLibrary: () => void;
    onComplete: (file: File) => void;
    downloadAudio: (url: string) => Promise<File>;
    resetGeneration: () => void;
    text: string;
    onTextChange: (text: string) => void;
    speed: number;
    onSpeedChange: (speed: number) => void;
}

export const KokoroForm: React.FC<KokoroFormProps> = ({
    isVoicesLoading,
    isGenerating,
    status,
    lastGeneratedAudioUrl,
    onGenerate,
    selectedVoice,
    onOpenLibrary,
    onComplete,
    downloadAudio,
    resetGeneration,
    text,
    onTextChange,
    speed,
    onSpeedChange
}) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleGenerate = () => {
        if (selectedVoice && text) {
            onGenerate(text, selectedVoice.id, speed);
        }
    };

    const handleUseAudio = async () => {
        if (!lastGeneratedAudioUrl) return;

        setIsDownloading(true);
        try {
            const file = await downloadAudio(lastGeneratedAudioUrl);
            onComplete(file);
        } catch (error) {
            alert('Failed to download audio');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleGenerateAgain = () => {
        resetGeneration();
    };

    return (
        <div className="flex flex-col h-full">
            {/* Scrollable Content */}
            <div
                className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
                style={{ scrollbarGutter: 'stable' }}
            >
                {/* Text Input */}
                <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-900 ml-1">Script</label>
                    <div className="relative group">
                        <textarea
                            value={text}
                            onChange={(e) => onTextChange(e.target.value)}
                            placeholder="Type something for Kokoro to say..."
                            className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-sm leading-relaxed text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none min-h-[140px] transition-all hover:border-gray-300"
                            disabled={isGenerating}
                        />
                        <div className="absolute bottom-4 right-4 text-xs font-medium text-gray-400 bg-white px-2 py-1 rounded-md border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                            {text.length} chars
                        </div>
                    </div>
                </div>

                {/* Voice Selection */}
                <KokoroVoiceSelector
                    selectedVoice={selectedVoice}
                    onOpenLibrary={onOpenLibrary}
                    isLoading={isVoicesLoading}
                />

                {/* Speed Control */}
                <div className="space-y-4 bg-white p-4 rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-gray-900">Speed</label>
                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                            {speed}x
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0.5"
                        max="2.0"
                        step="0.1"
                        value={speed}
                        onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        disabled={isGenerating}
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>0.5x</span>
                        <span>1.0x</span>
                        <span>2.0x</span>
                    </div>
                </div>

                {/* Generated Audio Preview */}
                {lastGeneratedAudioUrl && (
                    <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 animate-in slide-in-from-bottom-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-indigo-600" />
                                Generated Result
                            </h3>
                            <span className="text-xs text-indigo-600 bg-white px-2 py-1 rounded-md font-medium">
                                Ready
                            </span>
                        </div>

                        <audio
                            controls
                            className="w-full h-10 rounded-lg"
                            src={lastGeneratedAudioUrl}
                        />

                        <div className="flex gap-2">
                            <button
                                onClick={handleUseAudio}
                                disabled={isDownloading}
                                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isDownloading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Downloading...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Use This Audio
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleGenerateAgain}
                                disabled={isDownloading}
                                className="px-4 py-2.5 bg-white text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all border border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Again
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Sticky Footer Action Button */}
            {!lastGeneratedAudioUrl && (
                <div className="p-4 md:p-6 border-t border-gray-100 bg-white shrink-0 flex justify-end z-10">
                    <button
                        onClick={handleGenerate}
                        disabled={!text || !selectedVoice || isGenerating}
                        className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>{status}</span>
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-4 h-4" />
                                Generate Speech
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};
