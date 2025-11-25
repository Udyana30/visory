'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Play, Pause, Mic, Volume2, BookOpen, Eye, Trash2, Copy } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { UnifiedProject, getProjectDisplayName, getProjectAudioUrl } from '@/types/project';

interface Props {
  project: UnifiedProject;
  onDelete: (id: number, projectType: string) => void;
}

export default function ProjectCard({ project, onDelete }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  let cardContent: {
    tag: string;
    tagColor: string;
    icon: React.ReactNode;
    display: React.ReactNode;
    gradient: string;
    isClickable: boolean;
    metadata?: React.ReactNode;
  };

  if (project.project_type === 'stt') {
    cardContent = {
      tag: 'Speech to Text',
      tagColor: 'bg-cyan-600',
      icon: <Mic size={48} className="text-cyan-600 mx-auto mb-3" />,
      display: (
        <div className="w-full">
          <p className="text-sm text-gray-700 line-clamp-3 italic text-center">
            "{project.output_raw_text || 'No transcription available'}"
          </p>
        </div>
      ),
      gradient: 'from-teal-50 to-cyan-100',
      isClickable: false,
    };
  } else if (project.project_type === 'tts') {
    cardContent = {
      tag: 'Text to Speech',
      tagColor: 'bg-indigo-600',
      icon: <Volume2 size={48} className="text-indigo-600 mx-auto mb-3" />,
      display: (
        <div className="w-full">
          <p className="text-sm text-gray-700 line-clamp-3 text-center">
            {project.input_text || 'No input text'}
          </p>
        </div>
      ),
      gradient: 'from-blue-50 to-indigo-100',
      isClickable: false,
    };
  } else if (project.project_type === 'comic') {
    const pageSize = project.page_size 
      ? `${project.page_size.width}×${project.page_size.height}` 
      : 'Custom';
    
    cardContent = {
      tag: 'Comic Project',
      tagColor: 'bg-rose-600',
      icon: <BookOpen size={48} className="text-rose-600 mx-auto mb-3" />,
      display: (
        <div className="w-full space-y-2">
          <p className="text-base font-semibold text-gray-900 text-center line-clamp-1">
            {project.name}
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
            {project.art_style && (
              <span className="px-2 py-1 bg-white/60 rounded-full">
                {project.art_style}
              </span>
            )}
            <span className="px-2 py-1 bg-white/60 rounded-full">
              {pageSize}
            </span>
          </div>
        </div>
      ),
      gradient: 'from-rose-50 to-pink-100',
      isClickable: true,
      metadata: updatedAt && (
        <div className="mt-1 text-xs text-gray-400">
          Updated {updatedAt}
        </div>
      ),
    };
  } else {
    cardContent = {
      tag: 'Unknown',
      tagColor: 'bg-gray-600',
      icon: null,
      display: <p className="text-sm text-gray-500 text-center">Unknown project type</p>,
      gradient: 'from-gray-50 to-gray-100',
      isClickable: false,
    };
  }

  return (
    <>
      <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100">
        <div 
          className={`relative h-56 bg-gradient-to-br ${cardContent.gradient} flex items-center justify-center ${cardContent.isClickable ? 'cursor-pointer' : ''}`}
          onClick={cardContent.isClickable ? handleCardClick : undefined}
        >
          <div className={`absolute top-4 left-4 ${cardContent.tagColor} text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm`}>
            {cardContent.tag}
          </div>

          <div className="text-center px-6 w-full">
            {cardContent.icon}
            {cardContent.display}
          </div>

          {audioUrl && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="bg-white/95 hover:bg-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
                disabled={!audioUrl}
              >
                {isPlaying ? (
                  <Pause size={24} className="text-gray-700" />
                ) : (
                  <Play size={24} className="text-gray-700 fill-gray-700" />
                )}
              </button>
            </div>
          )}

          {cardContent.isClickable && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
              <div className="bg-white/95 hover:bg-white px-6 py-3 rounded-full shadow-lg transition-all hover:scale-105 flex items-center gap-2">
                <Eye size={20} className="text-gray-700" />
                <span className="text-sm font-medium text-gray-700">Open Project</span>
              </div>
            </div>
          )}

          {audioUrl && (
            <audio ref={audioRef} src={audioUrl} onEnded={handleEnded} preload="none" />
          )}
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">
                {displayName}
              </h3>
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
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isDeleting}
              >
                <MoreVertical size={20} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showMenu && (
        <div 
          ref={menuRef}
          className="fixed w-52 bg-white rounded-lg shadow-xl border border-gray-200 z-[9999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {cardContent.isClickable && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
                setShowMenu(false);
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
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
            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
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
            className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors disabled:opacity-50"
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