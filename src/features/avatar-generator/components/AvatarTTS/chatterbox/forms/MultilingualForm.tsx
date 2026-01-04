import React from 'react';
import { ChevronRight } from 'lucide-react';
import { SupportedLanguages } from '../../../../types/domain/chatterbox';

interface MultilingualFormProps {
    languages: SupportedLanguages;
    selectedLang: string;
    setSelectedLang: (lang: string) => void;
}

export const MultilingualForm: React.FC<MultilingualFormProps> = ({
    languages,
    selectedLang,
    setSelectedLang
}) => {
    return (
        <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900 ml-1">Target Language</label>
            <div className="relative">
                <select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none transition-all hover:border-gray-300"
                >
                    {Object.entries(languages).map(([code, name]) => (
                        <option key={code} value={code}>{name} ({code})</option>
                    ))}
                </select>
                <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
            </div>
        </div>
    );
};
