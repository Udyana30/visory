import { useState, useMemo } from 'react';
import { AvatarProject } from '../types/domain/project';
import { filterProjects, SortOption, FilterStatus, FilterType } from '../utils/projectFilters';

export const useProjectFilters = (projects: AvatarProject[]) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
    const [typeFilter, setTypeFilter] = useState<FilterType>('all');
    const [sortBy, setSortBy] = useState<SortOption>('date-desc');

    const filteredProjects = useMemo(() => {
        return filterProjects(projects, searchQuery, statusFilter, typeFilter, sortBy);
    }, [projects, searchQuery, statusFilter, typeFilter, sortBy]);

    const reset = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setTypeFilter('all');
        setSortBy('date-desc');
    };

    return {
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        typeFilter,
        setTypeFilter,
        sortBy,
        setSortBy,
        filteredProjects,
        reset
    };
};
