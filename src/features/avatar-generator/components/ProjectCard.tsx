import React, { useState, useEffect, useRef } from 'react';
import { Play, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { AvatarProject } from '../types/domain/project';
import { formatTimeAgo, formatDuration } from '../utils/videoUtils';

interface ProjectCardProps {
    project: AvatarProject;
    onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
    const [isHovering, setIsHovering] = useState(false);
    const [duration, setDuration] = useState<number | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const { title, status, progress, imageUrl, videoUrl, createdAt, hasError } = project;

    // Load video duration
    useEffect(() => {
        if (status === 'finished' && videoUrl && !duration) {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.src = videoUrl;

            video.onloadedmetadata = () => {
                setDuration(Math.floor(video.duration));
            };
        }
    }, [status, videoUrl, duration]);

    const getStatusIcon = () => {
        if (hasError) return <AlertCircle className="w-4 h-4" />;
        if (status === 'finished') return <CheckCircle className="w-4 h-4" />;
        return <Clock className="w-4 h-4" />;
    };

    const getStatusColor = () => {
        if (hasError) return 'bg-red-500/90';
        if (status === 'finished') return 'bg-green-500/90';
        if (status === 'processing') return 'bg-blue-500/90';
        return 'bg-gray-500/90';
    };

    const getStatusText = () => {
        if (hasError) return 'Failed';
        if (status === 'finished') return 'Completed';
        if (status === 'processing') return `Processing ${progress}%`;
        return 'Queued';
    };

    return (
        <div
            className="group relative cursor-pointer"
            onClick={status === 'finished' ? onClick : undefined}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Card Container */}
            <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-gray-900 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">

                {/* Thumbnail/Video Preview */}
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                />

                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-60'
                    }`} />

                {/* Play Icon Overlay (Only for finished videos) */}
                {status === 'finished' && (
                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isHovering ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                        }`}>
                        <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center border-2 border-white/50 transition-transform duration-300 hover:scale-110 shadow-lg">
                            <Play className="w-8 h-8 text-white ml-1" fill="white" />
                        </div>
                    </div>
                )}

                {/* Processing Overlay */}
                {(status === 'processing' || status === 'queued') && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 max-w-[80%] shadow-xl">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                <span className="text-sm font-semibold text-gray-900">
                                    {status === 'queued' ? 'Queued' : 'Processing'}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                                    style={{ width: `${Math.max(5, progress)}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-600 mt-2">{progress}% complete</p>
                        </div>
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${getStatusColor()} backdrop-blur-md text-white text-xs font-medium shadow-lg`}>
                        {getStatusIcon()}
                        <span>{getStatusText()}</span>
                    </div>
                </div>

                {/* Duration Badge (Top Left) */}
                {status === 'finished' && duration !== null && (
                    <div className="absolute top-3 left-3">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium">
                            <Clock className="w-3 h-3" />
                            <span>{formatDuration(duration)}</span>
                        </div>
                    </div>
                )}

                {/* Info Overlay (Bottom) */}
                <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${isHovering ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-80'
                    }`}>
                    <h3 className="text-white font-bold text-sm line-clamp-2 mb-1">
                        {title || 'Untitled Project'}
                    </h3>
                    <p className="text-white/80 text-xs">
                        {typeof createdAt === 'string' ? formatTimeAgo(createdAt) : formatTimeAgo(createdAt.toISOString())}
                    </p>
                </div>
            </div>
        </div>
    );
};
