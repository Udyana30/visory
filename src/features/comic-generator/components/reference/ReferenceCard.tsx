import React, { useState, useRef, useEffect } from 'react';
import { User, Mountain, Sparkles, UploadCloud, CheckCircle2, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Reference } from '../../types/domain/reference';

interface ReferenceCardProps {
  data: Reference;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const ReferenceCard: React.FC<ReferenceCardProps> = ({
  data,
  isSelected,
  onSelect,
  onEdit,
  onDelete
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const isCharacter = data.type === 'character';
  const aspectRatio = isCharacter ? 'aspect-[3/4]' : 'aspect-video';
  
  const TypeIcon = isCharacter ? User : Mountain;
  const SourceIcon = data.source === 'upload' ? UploadCloud : Sparkles;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    setShowMenu(false);
    action();
  };

  return (
    <div 
      onClick={onSelect}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${aspectRatio} ${
        isSelected 
          ? 'ring-2 ring-blue-600 ring-offset-2' 
          : 'hover:ring-2 hover:ring-blue-100 hover:ring-offset-1'
      }`}
    >
      <img
        src={data.imageUrl}
        alt={data.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 opacity-60 group-hover:opacity-80 transition-opacity" />

      {isSelected && (
        <div className="absolute top-3 right-3 text-blue-500 bg-white rounded-full p-0.5 z-10">
          <CheckCircle2 className="w-5 h-5 fill-current" />
        </div>
      )}

      {onEdit && onDelete && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white text-gray-700 shadow-sm transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div 
              ref={menuRef}
              className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right"
            >
              <button
                onClick={(e) => handleMenuAction(e, () => onEdit(data.id))}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={(e) => handleMenuAction(e, () => onDelete(data.id))}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      <div className="absolute top-3 left-3 flex gap-2">
        <div className="px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg flex items-center gap-1.5 border border-white/10">
          <SourceIcon className="w-3 h-3 text-white/90" />
          <span className="text-[10px] font-medium text-white/90 uppercase tracking-wider">
            {data.source === 'upload' ? 'Custom' : 'AI'}
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
        <div className="flex items-center gap-2 mb-1">
          <TypeIcon className="w-3.5 h-3.5 text-white/70" />
          <h3 className="text-white font-medium text-sm truncate">{data.name}</h3>
        </div>
        <p className="text-[11px] text-white/60 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {data.prompt}
        </p>
      </div>
    </div>
  );
};