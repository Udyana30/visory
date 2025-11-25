'use client';

import { useMemo } from 'react';
import { useProjects } from '@/hooks/useProjects';
import ProjectCard from '../components/ProjectCard';
import ProjectSkeleton from '../components/ProjectSkeleton';
import EmptyState from '../components/EmptyState';

interface Props {
  filter: string;
}

export default function ProjectList({ filter }: Props) {
  const { projects, isLoading, error, deleteProject } = useProjects();

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (filter === 'All') return projects;
    return projects.filter(
      p => p.project_type.toLowerCase() === filter.toLowerCase()
    );
  }, [projects, filter]);

  const handleDelete = async (id: number, projectType: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this ${projectType.toUpperCase()} project? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      await deleteProject(id, projectType);
    } catch (err: any) {
      alert(err?.message || 'Failed to delete project. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <ProjectSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
      </div>
    );
  }

  if (filteredProjects.length === 0) {
    return filter === 'All' ? (
      <EmptyState />
    ) : (
      <div className="text-center py-12">
        <p className="text-gray-600">No projects found for {filter}.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProjects.map(project => (
        <ProjectCard
          key={`${project.project_type}-${project.id}`}
          project={project}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}