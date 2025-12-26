import React from 'react';
import { Download, AlertCircle, Trash2 } from 'lucide-react';
import { AvatarProject } from '../types/domain/project';
import { StatusBadge } from './StatusBadge';

interface VideoPlayerProps {
  project: AvatarProject;
  onDelete?: (id: string) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ project, onDelete }) => {
  const { id, status, videoUrl, imageUrl, progress, hasError, errorMessage } = project;

  if (status === 'finished' && videoUrl) {
    return (
      <div className="space-y-3">
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-[3/4] group shadow-sm border border-gray-200">
          <video
            src={videoUrl}
            controls
            poster={imageUrl}
            className="w-full h-full object-contain"
          />
          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="absolute top-2 right-2 p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-red-500/80 transition-colors opacity-0 group-hover:opacity-100"
              title="Delete Project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex items-center justify-between">
          <StatusBadge status="finished" />
          <a
            href={videoUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Video
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[3/4] border border-gray-200 group">
      <img
        src={imageUrl}
        alt="Preview"
        className="w-full h-full object-cover opacity-50 blur-sm transition-opacity duration-300"
      />

      {onDelete && (
        <button
          onClick={() => onDelete(id)}
          className="absolute top-2 right-2 p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-red-500/80 transition-colors z-10 opacity-0 group-hover:opacity-100"
          title="Delete Project"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/10 backdrop-blur-[2px]">
        {hasError ? (
          <div className="bg-white p-4 rounded-xl shadow-lg border border-red-100 max-w-[90%] w-full animate-in fade-in zoom-in duration-300">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Generation Failed</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{errorMessage || 'Unknown error occurred'}</p>
          </div>
        ) : (
          <div className="bg-white/95 p-6 rounded-2xl shadow-xl border border-white/20 backdrop-blur-md w-full max-w-[260px] animate-in fade-in zoom-in duration-300">
            <div className="mb-4">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  {status === 'queued' ? 'Queued' : 'Processing'}
                </span>
                <span className="text-sm font-bold text-gray-900">{progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.max(5, progress)}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 text-sm">
                {status === 'queued' ? 'Waiting in line...' : 'Generating your video...'}
              </h3>
              <p className="text-xs text-gray-500">
                This may take a few minutes depending on server load.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};