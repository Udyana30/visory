import React from 'react';
import { Music } from 'lucide-react';

interface AudioOrderSelectorProps {
    audioOrder: string;
    setAudioOrder: (order: string) => void;
    disabled?: boolean;
}

const orderOptions = [
    { id: 'meanwhile', label: 'Together' },
    { id: 'left_right', label: 'L → R' },
    { id: 'right_left', label: 'R → L' }
];

export const AudioOrderSelector: React.FC<AudioOrderSelectorProps> = ({
    audioOrder,
    setAudioOrder,
    disabled = false
}) => {
    return (
        <div className="pt-3 mt-auto border-t border-gray-200/50">
            <div className="flex items-center gap-1.5 mb-2">
                <Music className="w-3 h-3 text-gray-400" />
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Flow</label>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
                {orderOptions.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => setAudioOrder(opt.id)}
                        disabled={disabled}
                        className={`px-1 py-1.5 text-[10px] font-semibold rounded-md border transition-all ${audioOrder === opt.id
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                            }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
