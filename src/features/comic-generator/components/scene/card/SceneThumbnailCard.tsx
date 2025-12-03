import React from 'react';
import { Image as ImageIcon, Wand2, Trash2 } from 'lucide-react';
import { SceneVisualization } from '../../../types/domain/scene';

interface SceneThumbnailCardProps {
  scene: SceneVisualization;
  index: number;
  isActive: boolean;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const SceneThumbnailCard: React.FC<SceneThumbnailCardProps> = ({
  scene,
  index,
  isActive,
  onClick,
  onDelete
}) => {
  return (
    <div 
      onClick={onClick}
      className={`relative w-full aspect-video rounded-md cursor-pointer overflow-hidden border-2 transition-all group bg-white ${
        isActive 
          ? 'border-blue-600 ring-2 ring-blue-600/20' 
          : 'border-gray-200 hover:border-blue-400'
      }`}
    >
      {scene.imageUrl ? (
        <img 
          src={scene.imageUrl} 
          alt={`Scene ${index + 1}`} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center text-gray-400">
          <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
          <span className="text-xs font-medium">Draft</span>
        </div>
      )}

      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[10px] font-bold text-white">
        {index + 1}
      </div>

      <button
        onClick={onDelete}
        className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 shadow-sm"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {!scene.imageUrl && scene.prompt && (
        <div className="absolute bottom-2 right-2 p-1 bg-teal-100 rounded-full shadow-sm">
          <Wand2 className="w-3 h-3 text-teal-600" />
        </div>
      )}
    </div>
  );
};