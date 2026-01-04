import React from 'react';
import { Volume2, Loader2, Mic, Sparkles } from 'lucide-react';

interface VoiceSelectorProps {
    selectedVoiceName?: string;
    selectedVoiceId?: string;
    tags?: { label: string; type?: 'default' | 'primary' }[];
    onOpenLibrary: () => void;
    isLoading?: boolean;
    accentColor?: 'blue' | 'indigo';
    emptyStateIcon?: React.ReactNode;
    emptyStateText?: string;
    emptyStateSubtext?: string;
    label?: string;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
    selectedVoiceName,
    selectedVoiceId,
    tags = [],
    onOpenLibrary,
    isLoading,
    accentColor = 'blue',
    emptyStateIcon,
    emptyStateText = 'Select a voice from library',
    emptyStateSubtext = 'Choose from available voices',
    label = 'Voice Selection'
}) => {
    const colorClasses = {
        blue: {
            border: 'border-blue-100 hover:border-blue-200',
            iconBg: 'bg-blue-50',
            iconText: 'text-blue-600',
            buttonText: 'text-blue-600 hover:text-blue-700',
            buttonHoverBg: 'hover:bg-blue-50',
            emptyBorderHover: 'hover:border-blue-300',
            emptyBgHover: 'hover:bg-blue-50/30',
            emptyIconHoverBg: 'group-hover:bg-blue-100',
            emptyIconHoverText: 'group-hover:text-blue-600',
            emptyTextHover: 'group-hover:text-blue-700'
        },
        indigo: {
            border: 'border-indigo-100 hover:border-indigo-200',
            iconBg: 'bg-indigo-50',
            iconText: 'text-indigo-600',
            buttonText: 'text-indigo-600 hover:text-indigo-700',
            buttonHoverBg: 'hover:bg-indigo-50',
            emptyBorderHover: 'hover:border-indigo-300',
            emptyBgHover: 'hover:bg-indigo-50/30',
            emptyIconHoverBg: 'group-hover:bg-indigo-100',
            emptyIconHoverText: 'group-hover:text-indigo-600',
            emptyTextHover: 'group-hover:text-indigo-700'
        }
    };

    const colors = colorClasses[accentColor];
    const DefaultIcon = accentColor === 'indigo' ? Sparkles : Mic;
    const EmptyIcon = emptyStateIcon || <DefaultIcon className="w-5 h-5" />;

    return (
        <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900 ml-1">{label}</label>
            {selectedVoiceName ? (
                <div className={`group flex items-center justify-between p-4 bg-white border rounded-2xl shadow-sm transition-all ${colors.border}`}>
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${colors.iconBg} ${colors.iconText}`}>
                            <Volume2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-base font-bold text-gray-900">{selectedVoiceName}</p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                {tags.map((tag, index) => (
                                    <span key={index} className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100 capitalize">
                                        {tag.label}
                                    </span>
                                ))}
                                {selectedVoiceId && tags.length === 0 && (
                                    <span className="text-xs text-gray-500 font-medium tracking-wide">
                                        ID: {selectedVoiceId.slice(0, 8)}...
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onOpenLibrary}
                        className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${colors.buttonText} ${colors.buttonHoverBg}`}
                    >
                        Change Voice
                    </button>
                </div>
            ) : (
                <button
                    onClick={onOpenLibrary}
                    className={`w-full p-8 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-gray-500 transition-all duration-300 group ${colors.emptyBorderHover} ${colors.emptyBgHover}`}
                >
                    <div className={`w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center transition-colors ${colors.emptyIconHoverBg} ${colors.emptyIconHoverText}`}>
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : EmptyIcon}
                    </div>
                    <div className="text-center">
                        <span className={`block font-semibold text-gray-700 ${colors.emptyTextHover}`}>{emptyStateText}</span>
                        <span className="text-xs text-gray-400 mt-1">{emptyStateSubtext}</span>
                    </div>
                </button>
            )}
        </div>
    );
};
