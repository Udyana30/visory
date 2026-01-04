import { useState, useCallback } from 'react';
import { AvatarProject } from '../types/domain/project';

export const useVideoModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<AvatarProject | null>(null);

    const openModal = useCallback((project: AvatarProject) => {
        setSelectedProject(project);
        setIsOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setTimeout(() => setSelectedProject(null), 300);
    }, []);

    return {
        isOpen,
        selectedProject,
        openModal,
        closeModal
    };
};
