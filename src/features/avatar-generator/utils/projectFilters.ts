import { AvatarProject, AvatarStatus } from '../types/domain/project';

export type SortOption = 'date-desc' | 'date-asc' | 'duration-desc' | 'duration-asc';
export type FilterStatus = 'all' | AvatarStatus;

export const filterProjects = (
    projects: AvatarProject[],
    searchQuery: string,
    statusFilter: FilterStatus,
    sortBy: SortOption
): AvatarProject[] => {
    let filtered = [...projects];

    // Search filter
    if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(project =>
            project.title?.toLowerCase().includes(query)
        );
    }

    // Status filter
    if (statusFilter !== 'all') {
        filtered = filtered.filter(project => project.status === statusFilter);
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
