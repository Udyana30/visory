import React, { useState } from 'react';
import { Settings2, ChevronRight } from 'lucide-react';

interface AdvancedSettingsProps {
    temperature: number;
    setTemperature: (val: number) => void;
    exaggeration: number;
    setExaggeration: (val: number) => void;
    cfgWeight?: number | '';
    setCfgWeight?: (val: number) => void;
    repetitionPenalty?: number | '';
    setRepetitionPenalty?: (val: number) => void;
    minP?: number | '';
    setMinP?: (val: number | '') => void;
    topP?: number | '';
    setTopP?: (val: number | '') => void;
    mode: 'cloning' | 'multilingual' | 'voice-changer';
}

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
    temperature,
    setTemperature,
    exaggeration,
    setExaggeration,
    cfgWeight,
    setCfgWeight,
    repetitionPenalty,
    setRepetitionPenalty,
    minP,
    setMinP,
    topP,
    setTopP,
    mode
}) => {
    const [showSettings, setShowSettings] = useState(false);

    return (
        <div className="pt-2">
            <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors ml-1"
            >
                <Settings2 className="w-3.5 h-3.5" />
                {showSettings ? 'Hide Advanced Configuration' : 'Show Advanced Configuration'}
                <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${showSettings ? 'rotate-90' : ''}`} />
            </button>

            {showSettings && (
                <div className="mt-4 p-6 bg-white border border-gray-100 rounded-2xl space-y-6 animate-in slide-in-from-top-2 shadow-sm">
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs font-semibold text-gray-700">Temperature</label>
                                <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{temperature}</span>
                            </div>
                            <input
                                type="range"
                                min="0.1"
                                max="1.0"
                                step="0.1"
                                value={temperature}
                                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700"
                            />
                            <p className="text-[10px] text-gray-400 mt-1.5">Higher values = more expressive but less stable.</p>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs font-semibold text-gray-700">Style Exaggeration</label>
                                <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{exaggeration}</span>
                            </div>
                            <input
                                type="range"
                                min="0.0"
                                max="1.0"
                                step="0.1"
                                value={exaggeration}
                                onChange={(e) => setExaggeration(parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700"
                            />
                        </div>
                    </div>

                    {/* Advanced Cloning Settings */}
                    {mode === 'cloning' && setCfgWeight && setRepetitionPenalty && setMinP && setTopP && (
                        <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-6">
                            <div className="col-span-2 space-y-4">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-xs font-semibold text-gray-700">CFG Weight</label>
                                        <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{cfgWeight}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0.0"
                                        max="1.0"
                                        step="0.1"
                                        value={cfgWeight === '' ? 0 : cfgWeight}
                                        onChange={(e) => setCfgWeight(parseFloat(e.target.value))}
                                        className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-xs font-semibold text-gray-700">Repetition Penalty</label>
                                        <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{repetitionPenalty}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1.0"
                                        max="2.0"
                                        step="0.1"
                                        value={repetitionPenalty === '' ? 1.0 : repetitionPenalty}
                                        onChange={(e) => setRepetitionPenalty(parseFloat(e.target.value))}
                                        className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-700 block mb-2">Min P</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={minP}
                                    onChange={(e) => setMinP(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                    className="w-full px-3 py-2 text-xs font-mono text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-700 block mb-2">Top P</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={topP}
                                    onChange={(e) => setTopP(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                    className="w-full px-3 py-2 text-xs font-mono text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
