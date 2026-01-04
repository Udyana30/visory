import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

interface VoiceLibraryFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    showGenderFilter?: boolean;
    selectedGender?: 'all' | 'male' | 'female';
    onGenderChange?: (gender: 'all' | 'male' | 'female') => void;
    showLanguageFilter?: boolean;
    languages?: string[];
    selectedLanguage?: string;
    onLanguageChange?: (language: string) => void;
}

export const VoiceLibraryFilters: React.FC<VoiceLibraryFiltersProps> = ({
    searchQuery,
    onSearchChange,
    showGenderFilter = false,
    selectedGender = 'all',
    onGenderChange,
    showLanguageFilter = false,
    languages = [],
    selectedLanguage = 'all',
    onLanguageChange
}) => {
    return (
        <div className="space-y-3">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search voices..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
            </div>

            {/* Gender & Language Filters */}
            {(showGenderFilter || showLanguageFilter) && (
                <div className="flex items-center gap-2">
                    {/* Gender Filter */}
                    {showGenderFilter && onGenderChange && (
                        <div className="flex bg-gray-100 p-0.5 rounded-lg">
                            {(['all', 'male', 'female'] as const).map((gender) => (
                                <button
                                    key={gender}
                                    onClick={() => onGenderChange(gender)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${selectedGender === gender
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {gender}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Language Filter */}
                    {showLanguageFilter && onLanguageChange && languages.length > 0 && (
                        <div className="relative flex-1">
                            <select
                                value={selectedLanguage}
                                onChange={(e) => onLanguageChange(e.target.value)}
                                className="w-full pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none cursor-pointer font-medium"
                            >
                                <option value="all">All Languages</option>
                                {languages.map(lang => (
                                    <option key={lang} value={lang}>{lang}</option>
                                ))}
                            </select>
                            <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
