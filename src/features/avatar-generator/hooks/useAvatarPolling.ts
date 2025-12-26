import { useState, useEffect, useRef, useCallback } from 'react';
import { AvatarProject } from '../types/domain/project';
import { avatarProjectService } from '../services/avatarProjectService';
import { POLLING_INTERVAL, MAX_POLLING_ATTEMPTS } from '../constants/defaults';

interface UseAvatarPollingProps {
  initialProject: AvatarProject;
  onComplete?: (project: AvatarProject) => void;
}

export const useAvatarPolling = ({ initialProject, onComplete }: UseAvatarPollingProps) => {
  const [project, setProject] = useState<AvatarProject>(initialProject);
  const [isPolling, setIsPolling] = useState(
    initialProject.status === 'queued' || initialProject.status === 'processing'
  );

  const attemptsRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkStatus = useCallback(async () => {
    if (!isPolling) return;

    if (attemptsRef.current >= MAX_POLLING_ATTEMPTS) {
      setIsPolling(false);
      return;
    }

    try {
      const update = await avatarProjectService.getStatus(project.id);

      setProject((prev) => ({
        ...prev,
        status: update.status,
        progress: update.progress,
        videoUrl: update.videoUrl,
        hasError: update.hasError,
        errorMessage: update.errorMessage,
      }));

      if (update.status === 'finished' || update.status === 'failed') {
        setIsPolling(false);
        if (update.status === 'finished' && onComplete) {
          onComplete({ ...project, ...update });
        }
      } else {
        attemptsRef.current += 1;
        timeoutRef.current = setTimeout(checkStatus, POLLING_INTERVAL);
      }
    } catch (error) {
      console.error('Polling failed', error);
      setIsPolling(false);
    }
  }, [isPolling, project.id, onComplete, project]);

  useEffect(() => {
    if (isPolling) {
      timeoutRef.current = setTimeout(checkStatus, POLLING_INTERVAL);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPolling, checkStatus]);

  return {
    project,
    isPolling,
  };
};