import React from 'react';
import { Download, Play, AlertCircle } from 'lucide-react';
import { AvatarProject } from '../types/domain/project';
import { StatusBadge } from './StatusBadge';

interface VideoPlayerProps {
  project: AvatarProject;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ project }) => {
  const { status, videoUrl, imageUrl, progress, hasError, errorMessage } = project;

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
    <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[3/4] border border-gray-200">
      <img 
        src={imageUrl} 
        alt="Preview" 
        className="w-full h-full object-cover opacity-50 blur-sm"
      />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/5 backdrop-blur-[2px]">
        {hasError ? (
          <div className="bg-white p-4 rounded-xl shadow-lg border border-red-100 max-w-[80%]">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Generation Failed</h3>
            <p className="text-xs text-gray-500">{errorMessage || 'Unknown error occurred'}</p>
          </div>
        ) : (
          <div className="bg-white/90 p-6 rounded-2xl shadow-lg border border-white/20 backdrop-blur-md w-full max-w-[240px]">
            <div className="relative w-12 h-12 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
              <div 
                className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold text-blue-600">{progress}%</span>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Generating Video...</h3>
            <p className="text-xs text-gray-500">
              {status === 'queued' ? 'Waiting in queue' : 'Processing your avatar'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};