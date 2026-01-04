import React, { useEffect, useRef, useState } from 'react';
import { X, Download, Trash2, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { AvatarProject } from '../types/domain/project';
import { useScrollLock } from '@/hooks/useScrollLock';

interface VideoModalProps {
    isOpen: boolean;
    project: AvatarProject | null;
    onClose: () => void;
    onDelete?: (id: string) => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, project, onClose, onDelete }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useScrollLock(isOpen);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === ' ' && videoRef.current) {
                e.preventDefault();
                togglePlayPause();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Auto-play on open
    useEffect(() => {
        if (isOpen && videoRef.current) {
            videoRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(err => console.log('Auto-play prevented:', err));
        }
    }, [isOpen]);

    // Auto-hide controls
    useEffect(() => {
        if (showControls && isPlaying) {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
            controlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false);
            }, 3000);
        }

        return () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, [showControls, isPlaying]);

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(!isMuted);
        }
    };

    const toggleFullscreen = () => {
        if (videoRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                videoRef.current.requestFullscreen();
            }
        }
    };

    const handleMouseMove = () => {
        setShowControls(true);
    };

    const handleDelete = () => {
        if (onDelete && confirm('Delete this project?')) {
            onDelete(project!.id);
            onClose();
        }
    };

    if (!isOpen || !project) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={onClose}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2.5 bg-white/90 hover:bg-white rounded-full text-gray-900 transition-all hover:scale-110 z-10 shadow-lg"
            >
                <X className="w-5 h-5" />
            </button>

            {/* Video Container */}
            <div
                className="relative max-w-[85vw] max-h-[85vh] animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
                onMouseMove={handleMouseMove}
            >
                <video
                    ref={videoRef}
                    src={project.videoUrl}
                    poster={project.imageUrl}
                    className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl"
                    onClick={togglePlayPause}
                />

                {/* Custom Controls Overlay */}
                <div className={`absolute inset-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                    {/* Top Gradient */}
                    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 to-transparent rounded-t-2xl" />

                    {/* Bottom Gradient + Controls */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6 rounded-b-2xl">
                        {/* Title */}
                        <h2 className="text-white font-bold text-lg mb-4">
                            {project.title || 'Untitled Project'}
                        </h2>

                        {/* Control Buttons */}
                        <div className="flex items-center gap-3 mb-4">
                            {/* Play/Pause */}
                            <button
                                onClick={togglePlayPause}
                                className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
                            >
                                {isPlaying ? <Pause className="w-5 h-5" fill="white" /> : <Play className="w-5 h-5 ml-0.5" fill="white" />}
                            </button>

                            {/* Mute/Unmute */}
                            <button
                                onClick={toggleMute}
                                className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
                            >
                                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </button>

                            {/* Fullscreen */}
                            <button
                                onClick={toggleFullscreen}
                                className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
                            >
                                <Maximize className="w-5 h-5" />
                            </button>

                            <div className="flex-1" />

                            {/* Download */}
                            <a
                                href={project.videoUrl}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-all hover:scale-105"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Download className="w-4 h-4" />
                                Download
                            </a>

                            {/* Delete */}
                            {onDelete && (
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-all hover:scale-105"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Keyboard Hints */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-xs bg-black/40 backdrop-blur-md px-4 py-2 rounded-full">
                Press <kbd className="px-2 py-0.5 bg-white/20 rounded mx-1">ESC</kbd> to close • <kbd className="px-2 py-0.5 bg-white/20 rounded mx-1">SPACE</kbd> to play/pause
            </div>
        </div>
    );
};
