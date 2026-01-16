'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Play, Pause, Mic, Volume2, BookOpen, Eye, Trash2, Copy, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { UnifiedProject, getProjectDisplayName, getProjectAudioUrl } from '@/types/project';

interface Props {
  project: UnifiedProject;
  onDelete: (id: number, projectType: string) => void;
}

// Consistent placeholder image for comic projects (matching home style)
const PROJECT_COVERS = {
  comic: `https://images.unsplash.com/photo-1618004652321-13a63e576b80?w=400&h=300&fit=crop&q=80`,
  stt: `https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=300&fit=crop&q=80`,
  tts: `https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=400&h=300&fit=crop&q=80`,
  default: `https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=300&fit=crop&q=80`
};

export default function ProjectCard({ project, onDelete }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(e.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    const handleScroll = () => {
      if (showMenu) {
        updateMenuPosition();
      }
    };

    document.addEventListener('mousedown', clickOutside);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousedown', clickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [showMenu]);

  const updateMenuPosition = () => {
    if (menuButtonRef.current && menuRef.current) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      const menuHeight = menuRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;

      let top = rect.bottom + 8;

      if (top + menuHeight > viewportHeight) {
        top = rect.top - menuHeight - 8;
      }

      menuRef.current.style.top = `${top}px`;
      menuRef.current.style.left = `${rect.right - 208}px`;
    }
  };

  useEffect(() => {
    if (showMenu) {
      updateMenuPosition();
    }
  }, [showMenu]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleEnded = () => setIsPlaying(false);

  const handleCardClick = () => {
    if (project.project_type === 'comic') {
      router.push(`/tools/comic-generator?projectId=${project.id}`);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setShowMenu(false);
    try {
      await onDelete(project.id, project.project_type);
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = () => {
    console.log('Duplicate project:', project.id);
    setShowMenu(false);
  };

  const displayName = getProjectDisplayName(project);
  const audioUrl = getProjectAudioUrl(project);
  const createdAt = formatDistanceToNow(new Date(project.created_at), { addSuffix: true });
  const updatedAt = project.updated_at
    ? formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })
    : null;

  // Get cover image based on project type
  const coverImage = PROJECT_COVERS[project.project_type as keyof typeof PROJECT_COVERS] || PROJECT_COVERS.default;

  let cardContent: {
    tag: string;
    tagColor: string;
    tagBg: string;
    icon: React.ReactNode;
    isClickable: boolean;
    metadata?: React.ReactNode;
  };

  if (project.project_type === 'stt') {
    cardContent = {
      tag: 'Speech to Text',
      tagColor: 'text-white',
      tagBg: 'bg-cyan-600/90',
      icon: <Mic size={16} className="text-white" />,
      isClickable: false,
    };
  } else if (project.project_type === 'tts') {
    cardContent = {
      tag: 'Text to Speech',
      tagColor: 'text-white',
      tagBg: 'bg-indigo-600/90',
      icon: <Volume2 size={16} className="text-white" />,
      isClickable: false,
    };
  } else if (project.project_type === 'comic') {
    cardContent = {
      tag: 'Comic',
      tagColor: 'text-white',
      tagBg: 'bg-gray-900/80',
      icon: <BookOpen size={16} className="text-white" />,
      isClickable: true,
      metadata: updatedAt && (
        <div className="mt-1 text-xs text-gray-400">
          Updated {updatedAt}
        </div>
      ),
    };
  } else {
    cardContent = {
      tag: 'Project',
      tagColor: 'text-white',
      tagBg: 'bg-gray-600/90',
      icon: <Sparkles size={16} className="text-white" />,
      isClickable: false,
    };
  }

  return (
    <>
      <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:-translate-y-1">
        <div
          className={`relative h-56 overflow-hidden ${cardContent.isClickable ? 'cursor-pointer' : ''}`}
          onClick={cardContent.isClickable ? handleCardClick : undefined}
        >
          {/* Cover Image with overlay gradient */}
          <div className="absolute inset-0">
            <img
              src={coverImage}
              alt={displayName}
              className={`w-full h-full object-cover transition-all duration-700 ${imageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'} group-hover:scale-105`}
              onLoad={() => setImageLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>

          {/* Tag Badge - Themed styling */}
          <div className={`absolute top-4 left-4 ${cardContent.tagBg} backdrop-blur-sm ${cardContent.tagColor} px-3 py-1.5 rounded-full text-xs font-medium shadow-lg flex items-center gap-1.5 transition-all duration-300 group-hover:scale-105`}>
            {cardContent.icon}
            {cardContent.tag}
          </div>

          {/* Project Name Overlay - Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <h3 className="text-lg font-bold mb-1 line-clamp-2 drop-shadow-lg">
              {project.project_type === 'comic' ? project.name : displayName}
            </h3>
            {project.project_type === 'comic' && (
              <div className="flex items-center gap-2 text-xs">
                {project.art_style && (
                  <span className="px-2 py-0.5 bg-white/25 backdrop-blur-sm rounded-full">
                    {project.art_style}
                  </span>
                )}
                {project.page_size && (
                  <span className="px-2 py-0.5 bg-white/25 backdrop-blur-sm rounded-full">
                    {project.page_size.width}×{project.page_size.height}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Audio Play Button Overlay */}
          {audioUrl && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="bg-white/95 hover:bg-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 backdrop-blur-sm"
                disabled={!audioUrl}
              >
                {isPlaying ? (
                  <Pause size={24} className="text-gray-800" />
                ) : (
                  <Play size={24} className="text-gray-800 fill-gray-800" />
                )}
              </button>
            </div>
          )}

          {/* Open Project Overlay */}
          {cardContent.isClickable && !audioUrl && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20">
              <div className="bg-white/95 hover:bg-white px-6 py-3 rounded-full shadow-2xl transition-all hover:scale-105 flex items-center gap-2 backdrop-blur-sm">
                <Eye size={20} className="text-gray-800" />
                <span className="text-sm font-semibold text-gray-800">Open Project</span>
              </div>
            </div>
          )}

          {audioUrl && (
            <audio ref={audioRef} src={audioUrl} onEnded={handleEnded} preload="none" />
          )}
        </div>

        {/* Card Footer */}
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-500">Created {createdAt}</p>
              {cardContent.metadata}
            </div>

            <div className="flex-shrink-0 ml-2">
              <button
                ref={menuButtonRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isDeleting}
              >
                <MoreVertical size={18} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showMenu && (
        <div
          ref={menuRef}
          className="fixed w-52 bg-white rounded-xl shadow-2xl border border-gray-200 z-[9999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {cardContent.isClickable && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
                setShowMenu(false);
              }}
              className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
              <Eye size={16} />
              Open Project
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDuplicate();
            }}
            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
            disabled={isDeleting}
          >
            <Copy size={16} />
            Duplicate
          </button>
          <div className="border-t border-gray-100" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors disabled:opacity-50"
            disabled={isDeleting}
          >
            <Trash2 size={16} />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}
    </>
  );
}