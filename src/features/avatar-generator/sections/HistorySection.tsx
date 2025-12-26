import React from 'react';
import { RefreshCw } from 'lucide-react';
import { VideoPlayer } from '../components/VideoPreview';
import { useAvatarHistory } from '../hooks/useAvatarHistory';
import { useAvatarPolling } from '../hooks/useAvatarPolling';
import { useAvatarActions } from '../hooks/useAvatarActions';
import { AvatarProject } from '../types/domain/project';
import { useAuth } from '@/hooks/useAuth';

const PollingWrapper: React.FC<{ project: AvatarProject; onDelete: (id: string) => void }> = ({ project, onDelete }) => {
  const { project: liveProject } = useAvatarPolling({
    initialProject: project
  });

  return <VideoPlayer project={liveProject} onDelete={onDelete} />;
};

export const HistorySection: React.FC = () => {
  const { user } = useAuth();
  const { projects, isLoading, refresh } = useAvatarHistory(user?.id);
  const { deleteAvatar } = useAvatarActions();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteAvatar(id);
        refresh();
      } catch (error) {
        console.error('Failed to delete project:', error);
        alert('Failed to delete project');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Recent Generations</h3>
        <button
          onClick={() => refresh()}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
          title="Refresh List"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {!isLoading && projects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500 font-medium">No avatars generated yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <PollingWrapper key={project.id} project={project} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};