import React from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { ProjectCard } from '../components/ProjectCard';
import { VideoModal } from '../components/VideoModal';
import { FilterControls } from '../components/FilterControls';
import { useAvatarHistory } from '../hooks/useAvatarHistory';
import { useAvatarPolling } from '../hooks/useAvatarPolling';
import { useVideoModal } from '../hooks/useVideoModal';
import { useProjectFilters } from '../hooks/useProjectFilters';
import { useAvatarActions } from '../hooks/useAvatarActions';
import { AvatarProject } from '../types/domain/project';
import { useAuth } from '@/hooks/useAuth';

const PollingWrapper: React.FC<{
  project: AvatarProject;
  onClick: (project: AvatarProject) => void;
}> = ({ project, onClick }) => {
  const { project: liveProject } = useAvatarPolling({
    initialProject: project
  });

  return (
    <ProjectCard
      project={liveProject}
      onClick={() => onClick(liveProject)}
    />
  );
};

export const HistorySection: React.FC = () => {
  const { user } = useAuth();
  const { projects, isLoading, refresh } = useAvatarHistory(user?.id);
  const { deleteAvatar } = useAvatarActions();
  const { isOpen, selectedProject, openModal, closeModal } = useVideoModal();

  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    filteredProjects,
    reset: resetFilters
  } = useProjectFilters(projects);

  const handleDelete = async (id: string) => {
    try {
      await deleteAvatar(id);
      refresh();
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between gap-4">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Recent Generations</h3>
            <p className="text-sm text-gray-500">
              {filteredProjects.length} of {projects.length} videos
            </p>
          </div>
        </div>

        {/* Controls: Search, Filter, Refresh */}
        <div className="flex items-center gap-2">
          <FilterControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onReset={resetFilters}
          />

          <button
            onClick={() => refresh()}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-gray-700 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Empty State */}
      {!isLoading && filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {projects.length === 0 ? 'No videos yet' : 'No matching videos'}
          </h3>
          <p className="text-gray-500 text-sm">
            {projects.length === 0
              ? 'Generate your first avatar video to see it here'
              : 'Try adjusting your filters or search query'}
          </p>
        </div>
      ) : (
        <>
          {/* Grid - 3 Columns Maximum */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <PollingWrapper
                key={project.id}
                project={project}
                onClick={openModal}
              />
            ))}
          </div>

          {/* Loading Indicator */}
          {isLoading && projects.length > 0 && (
            <div className="text-center py-4">
              <RefreshCw className="w-5 h-5 text-gray-400 animate-spin mx-auto" />
            </div>
          )}
        </>
      )}

      {/* Video Modal */}
      <VideoModal
        isOpen={isOpen}
        project={selectedProject}
        onClose={closeModal}
        onDelete={handleDelete}
      />
    </div>
  );
};