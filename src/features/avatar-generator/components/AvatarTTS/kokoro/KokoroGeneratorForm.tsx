import React, { useState } from 'react';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { KokoroVoice } from '../../../types/domain/kokoro';
import { VoiceSelector } from '../shared/VoiceSelector';
import { GenerationResult } from '../shared/GenerationResult';

interface KokoroGeneratorFormProps {
    isVoicesLoading: boolean;
    isGenerating: boolean;
    status: string;
    lastGeneratedAudioUrl: string | null;
    onGenerate: (text: string, voice: string, speed: number) => void;
    selectedVoice: KokoroVoice | null;
    onOpenLibrary: () => void;
    onUseAudio: (url: string) => void;
    onReset: () => void;
    text: string;
    onTextChange: (text: string) => void;
    speed: number;
    onSpeedChange: (speed: number) => void;
}

export const KokoroGeneratorForm: React.FC<KokoroGeneratorFormProps> = ({
    isVoicesLoading,
    isGenerating,
    status,
    lastGeneratedAudioUrl,
    onGenerate,
    selectedVoice,
    onOpenLibrary,
    onUseAudio,
    onReset,
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
            await onUseAudio(lastGeneratedAudioUrl);
        } finally {
            setIsDownloading(false);
        }
    };

    const tags = selectedVoice ? [
        { label: selectedVoice.gender },
        { label: selectedVoice.language }
    ] : [];

    return (
        <div className="flex flex-col h-full">
            <div
                className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
                style={{ scrollbarGutter: 'stable' }}
            >
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

                <VoiceSelector
                    selectedVoiceName={selectedVoice?.name}
                    selectedVoiceId={selectedVoice?.id}
                    tags={tags}
                    onOpenLibrary={onOpenLibrary}
                    isLoading={isVoicesLoading}
                    accentColor="indigo"
                    emptyStateIcon={<Sparkles className="w-5 h-5" />}
                    emptyStateText="Select a voice from library"
                    emptyStateSubtext="Choose from Kokoro AI voices"
                    label="Voice Model"
                />

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

                <GenerationResult
                    audioUrl={lastGeneratedAudioUrl}
                    status={lastGeneratedAudioUrl ? 'completed' : 'idle'}
                    onUse={handleUseAudio}
                    onRegenerate={onReset}
                    isDownloading={isDownloading}
                    accentColor="indigo"
                />
            </div>

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
