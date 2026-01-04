'use client';

import React from 'react';
import { LayoutGrid, User, Search, Plus, Image as ImageIcon } from 'lucide-react';
import { AvatarTemplate } from '../../types/domain/template';
import { TemplateCard } from './TemplateCard';
import { TemplateSkeleton } from './TemplateSkeleton';

interface TemplateLibraryViewProps {
    activeTab: 'all' | 'mine';
    onTabChange: (tab: 'all' | 'mine') => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    filteredTemplates: AvatarTemplate[];
    isLoading: boolean;
    selectedId?: string;
    onSelect: (template: AvatarTemplate) => void;
    onDelete: (id: string) => void;
    onCreateNew: () => void;
}

export const TemplateLibraryView: React.FC<TemplateLibraryViewProps> = ({
    activeTab,
    onTabChange,
    searchQuery,
    onSearchChange,
    filteredTemplates,
    isLoading,
    selectedId,
    onSelect,
    onDelete,
    onCreateNew,
}) => {
    return (
        <div className="flex flex-col flex-1 min-h-0 pb-5">
            {/* Search Bar & Tabs */}
            <div className="px-6 py-3 border-b border-gray-100 bg-white shrink-0">
                <div className="flex items-center gap-4">
                    {/* Tabs */}
                    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => onTabChange('all')}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'all'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            All Templates
                        </button>
                        <button
                            onClick={() => onTabChange('mine')}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'mine'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <User className="w-4 h-4" />
                            My Templates
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm text-gray-900 placeholder-gray-400"
                        />
                    </div>
                </div>
            </div>

            {/* Template Grid */}
            <div className="flex-1 overflow-y-scroll px-6 pt-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {filteredTemplates.length === 0 && !isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-sm font-medium mb-2">
                            {searchQuery ? 'No templates found matching your search' : 'No templates found'}
                        </p>
                        {searchQuery && (
                            <button
                                onClick={() => onSearchChange('')}
                                className="text-sm text-blue-600 hover:text-blue-700 underline"
                            >
                                Clear search
                            </button>
                        )}
                        {activeTab === 'mine' && !searchQuery && (
                            <button
                                onClick={onCreateNew}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Create Your First Template
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
                        {/* Add New Template Card */}
                        {activeTab === 'mine' && !searchQuery && (
                            <button
                                onClick={onCreateNew}
                                className="aspect-[3/4] border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-3 text-gray-500 hover:text-blue-600 group"
                            >
                                <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-blue-600 flex items-center justify-center transition-colors">
                                    <Plus className="w-6 h-6 group-hover:text-white transition-colors" />
                                </div>
                                <span className="text-sm font-medium">Add New Template</span>
                            </button>
                        )}

                        {filteredTemplates.map((template) => (
                            <TemplateCard
                                key={template.avatar_id}
                                template={template}
                                isSelected={selectedId === template.avatar_id}
                                onSelect={onSelect}
                                onDelete={activeTab === 'mine' ? onDelete : undefined}
                                isOwner={activeTab === 'mine'}
                            />
                        ))}

                        {/* Loading Skeletons */}
                        {isLoading && (
                            <>
                                <TemplateSkeleton />
                                <TemplateSkeleton />
                                <TemplateSkeleton />
                                <TemplateSkeleton />
                                <TemplateSkeleton />
                                <TemplateSkeleton />
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
