import { AvatarProject } from '../types/domain/project';

export type SortOption = 'date-desc' | 'date-asc' | 'duration-desc' | 'duration-asc';
export type FilterStatus = 'all' | 'queued' | 'processing' | 'finished' | 'failed';
export type FilterType = 'all' | 'single_person' | 'multi_person';

export const filterProjects = (
    projects: AvatarProject[],
    searchQuery: string,
    statusFilter: FilterStatus,
    typeFilter: FilterType,
    sortBy: SortOption
): AvatarProject[] => {
    let filtered = [...projects];

    // Search filter
    if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(project =>
            project.title?.toLowerCase().includes(query) ||
            project.description?.toLowerCase().includes(query)
        );
    }

    // Status filter
    if (statusFilter !== 'all') {
        filtered = filtered.filter(project => project.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
        filtered = filtered.filter(project => project.type === typeFilter);
    }

    // Sort
    filtered.sort((a, b) => {
        switch (sortBy) {
            case 'date-desc':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'date-asc':
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case 'duration-desc':
                return b.id.localeCompare(a.id);
            case 'duration-asc':
                return a.id.localeCompare(b.id);
            default:
                return 0;
        }
    });

    return filtered;
};
