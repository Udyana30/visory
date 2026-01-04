import { useState, useMemo } from 'react';
import { AvatarProject } from '../types/domain/project';
import { filterProjects, SortOption, FilterStatus } from '../utils/projectFilters';

export const useProjectFilters = (projects: AvatarProject[]) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
    const [sortBy, setSortBy] = useState<SortOption>('date-desc');

    const filteredProjects = useMemo(() => {
        return filterProjects(projects, searchQuery, statusFilter, sortBy);
    }, [projects, searchQuery, statusFilter, sortBy]);

    const reset = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setSortBy('date-desc');
    };

    return {
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        sortBy,
        setSortBy,
        filteredProjects,
        reset
    };
};
