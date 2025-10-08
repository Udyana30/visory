'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Play, Pause, Mic, Volume2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ProjectCard({ project, onDelete }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const audioRef = useRef(null);
  const menuRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleAudioEnd = () => setIsPlaying(false);

  const formattedDate = formatDistanceToNow(new Date(project.created_at), { addSuffix: true });

  let cardContent;

  if (project.project_type === 'stt') {
    cardContent = {
      tag: 'STT Audio',
      icon: <Mic size={48} className="text-cyan-600 mx-auto mb-3" />,
      displayText: <p className="text-sm text-gray-700 line-clamp-2 italic">"{project.output_raw_text}"</p>,
      audioUrl: project.input_audio_url,
      gradient: 'from-teal-50 to-cyan-100',
    };
  } else if (project.project_type === 'tts') {
    cardContent = {
      tag: 'TTS Audio',
      icon: <Volume2 size={48} className="text-indigo-600 mx-auto mb-3" />,
      displayText: <p className="text-sm text-gray-700 line-clamp-2">{project.input_text}</p>,
      audioUrl: project.public_url,
      gradient: 'from-blue-50 to-indigo-100',
    };
  } else {
    cardContent = {
      tag: 'Project',
      icon: null,
      displayText: 'Unknown project type.',
      audioUrl: '',
      gradient: 'from-gray-50 to-gray-100'
    }
  }

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className={`relative h-56 bg-gradient-to-br ${cardContent.gradient} flex items-center justify-center`}>
        <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1 rounded text-xs font-medium">
          {cardContent.tag}
        </div>
        <div className="text-center px-6">
          {cardContent.icon}
          {cardContent.displayText}
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/15">
          <button onClick={togglePlay} className="bg-white/90 p-4 rounded-full">
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="fill-gray-600" />}
          </button>
        </div>
        <audio ref={audioRef} src={cardContent.audioUrl} onEnded={handleAudioEnd} preload="none" />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">{project.title}</h3>
            <p className="text-sm text-gray-500">Created {formattedDate}</p>
          </div>
          <div className="relative ml-2" ref={menuRef}>
            <button onClick={() => setShowMenu(!showMenu)} className="p-1 hover:bg-gray-100 rounded">
                <MoreVertical size={20} className="text-gray-400" />
            </button>
            {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                    <button onClick={() => onDelete(project.id)} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                        Delete
                    </button>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}