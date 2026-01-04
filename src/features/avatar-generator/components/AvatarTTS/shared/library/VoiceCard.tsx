import React from 'react';
import { Volume2, Check } from 'lucide-react';

interface VoiceCardProps {
    id: string;
    name: string;
    gender?: string;
    language?: string;
    isSelected: boolean;
    onSelect: (id: string) => void;
    accentColor?: 'indigo' | 'blue';
}

export const VoiceCard: React.FC<VoiceCardProps> = ({
    id,
    name,
    gender,
    language,
    isSelected,
    onSelect,
    accentColor = 'indigo'
}) => {
    const colorClasses = {
        indigo: {
            border: 'border-indigo-500 ring-1 ring-indigo-500/20',
            bg: 'bg-indigo-100 text-indigo-600',
            bgHover: 'bg-indigo-50 text-indigo-500',
            badge: 'bg-indigo-100 text-indigo-700',
            text: 'text-indigo-900',
            checkBg: 'bg-indigo-600'
        },
        blue: {
            border: 'border-blue-500 ring-1 ring-blue-500/20',
            bg: 'bg-blue-100 text-blue-600',
            bgHover: 'bg-blue-50 text-blue-500',
            badge: 'bg-blue-100 text-blue-700',
            text: 'text-blue-900',
            checkBg: 'bg-blue-600'
        }
    };

    const colors = colorClasses[accentColor];

    return (
        <button
            onClick={() => onSelect(id)}
            className={`group relative p-4 rounded-xl border text-left transition-all duration-200 ${isSelected
                    ? `${colors.border} bg-${accentColor}-50 shadow-sm`
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
        >
            <div className="flex items-start gap-3 mb-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all ${isSelected
                        ? colors.bg
                        : `bg-gray-100 text-gray-400 group-hover:${colors.bgHover}`
                    }`}>
                    <Volume2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-bold truncate transition-colors mb-1 ${isSelected
                            ? colors.text
                            : 'text-gray-900 group-hover:text-gray-900'
                        }`}>
                        {name}
                    </h4>
                    {gender && (
                        <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md ${isSelected
                                    ? colors.badge
                                    : `bg-gray-100 text-gray-600 group-hover:${colors.badge}`
                                }`}>
                                {gender}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {language && (
                <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-lg ${isSelected
                            ? `bg-white ${colors.text} border border-${accentColor}-200`
                            : `bg-gray-50 text-gray-600 border border-gray-200 group-hover:border-${accentColor}-200 group-hover:${colors.text}`
                        }`}>
                        {language}
                    </span>

                    {isSelected && (
                        <div className={`flex items-center justify-center w-5 h-5 ${colors.checkBg} rounded-full`}>
                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                    )}
                </div>
            )}
        </button>
    );
};
