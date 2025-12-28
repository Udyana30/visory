import React, { useState, useMemo } from 'react';
import { Search, Volume2, Check, Filter, ChevronLeft } from 'lucide-react';
import { KokoroVoice } from '../../../types/domain/kokoro';

interface KokoroVoiceLibraryProps {
    voices: KokoroVoice[];
    selectedVoiceId: string;
    onSelect: (voiceId: string) => void;
    onBack: () => void;
}

export const KokoroVoiceLibrary: React.FC<KokoroVoiceLibraryProps> = ({
    voices,
    selectedVoiceId,
    onSelect,
    onBack
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGender, setSelectedGender] = useState<'all' | 'male' | 'female'>('all');
    const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

    // Extract unique languages
    const languages = useMemo(() => {
        const langs = new Set(voices.map(v => v.language));
        return Array.from(langs).sort();
    }, [voices]);

    // Filter voices
    const filteredVoices = useMemo(() => {
        return voices.filter(voice => {
            const matchesSearch = voice.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesGender = selectedGender === 'all' || voice.gender === selectedGender;
            const matchesLanguage = selectedLanguage === 'all' || voice.language === selectedLanguage;
            return matchesSearch && matchesGender && matchesLanguage;
        });
    }, [voices, searchQuery, selectedGender, selectedLanguage]);

    return (
        <div className="bg-white w-full flex flex-col overflow-hidden h-full">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3 bg-white shrink-0">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-50 rounded-full text-gray-500 hover:text-gray-900 transition-colors -ml-2"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Voice Library</h3>
                    <p className="text-sm text-gray-500">Select a voice for Kokoro</p>
                </div>
            </div>

            {/* Filters */}
            <div className="px-6 pt-4 pb-2 bg-white shrink-0 space-y-3">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search voices..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                </div>

                <div className="flex items-center gap-2">
                    {/* Gender Filter */}
                    <div className="flex bg-gray-100 p-0.5 rounded-lg">
                        {(['all', 'male', 'female'] as const).map((gender) => (
                            <button
                                key={gender}
                                onClick={() => setSelectedGender(gender)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${selectedGender === gender
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {gender}
                            </button>
                        ))}
                    </div>

                    {/* Language Filter */}
                    <div className="relative flex-1">
                        <select
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            className="w-full pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none cursor-pointer font-medium"
                        >
                            <option value="all">All Languages</option>
                            {languages.map(lang => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                        <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Voice Grid - 2 Columns */}
            <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50/50 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                {filteredVoices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <Search className="w-10 h-10 mb-3 opacity-50" />
                        <p className="text-sm font-medium">No voices found</p>
                        <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {filteredVoices.map((voice) => (
                            <button
                                key={voice.id}
                                onClick={() => {
                                    onSelect(voice.id);
                                    onBack();
                                }}
                                className={`group relative p-4 rounded-xl border text-left transition-all duration-200 ${selectedVoiceId === voice.id
                                    ? 'border-indigo-500 bg-indigo-50 shadow-sm ring-1 ring-indigo-500/20'
                                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md'
                                    }`}
                            >
                                {/* Icon & Name */}
                                <div className="flex items-start gap-3 mb-3">
                                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all ${selectedVoiceId === voice.id
                                        ? 'bg-indigo-100 text-indigo-600'
                                        : 'bg-gray-100 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'
                                        }`}>
                                        <Volume2 className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`text-sm font-bold truncate transition-colors mb-1 ${selectedVoiceId === voice.id
                                            ? 'text-indigo-900'
                                            : 'text-gray-900 group-hover:text-indigo-900'
                                            }`}>
                                            {voice.name}
                                        </h4>
                                        <div className="flex items-center gap-1.5">
                                            <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md ${selectedVoiceId === voice.id
                                                ? 'bg-indigo-100 text-indigo-700'
                                                : 'bg-gray-100 text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                                                }`}>
                                                {voice.gender}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Language Badge */}
                                <div className="flex items-center justify-between">
                                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-lg ${selectedVoiceId === voice.id
                                        ? 'bg-white text-indigo-700 border border-indigo-200'
                                        : 'bg-gray-50 text-gray-600 border border-gray-200 group-hover:border-indigo-200 group-hover:text-indigo-600'
                                        }`}>
                                        {voice.language}
                                    </span>

                                    {selectedVoiceId === voice.id && (
                                        <div className="flex items-center justify-center w-5 h-5 bg-indigo-600 rounded-full">
                                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
