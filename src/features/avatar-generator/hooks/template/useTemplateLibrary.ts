import { useState, useMemo } from 'react';
import { AvatarTemplate } from '../../types/domain/template';

export const useTemplateLibrary = (
    allTemplates: AvatarTemplate[],
    userTemplates: AvatarTemplate[]
) => {
    const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter out anonymous templates from user templates
    const filteredUserTemplates = useMemo(() => {
        return userTemplates.filter(template => template.user_id !== 'anonymous');
    }, [userTemplates]);

    // Get displayed templates based on active tab
    const displayedTemplates = useMemo(() => {
        return activeTab === 'all' ? allTemplates : filteredUserTemplates;
    }, [activeTab, allTemplates, filteredUserTemplates]);

    // Apply search filter to displayed templates
    const filteredTemplates = useMemo(() => {
        if (!searchQuery.trim()) return displayedTemplates;

        const query = searchQuery.toLowerCase();
        return displayedTemplates.filter(template =>
            template.name.toLowerCase().includes(query)
        );
    }, [displayedTemplates, searchQuery]);

    return {
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        filteredTemplates
    };
};
