import React from 'react';
import { useDrag } from 'react-dnd';
import { GripVertical } from 'lucide-react';
import { SceneVisualization } from '../../../types/domain/scene';

interface DraggableAssetProps {
  data: SceneVisualization;
}

export const DraggableAsset: React.FC<DraggableAssetProps> = ({ data }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'image',
    item: { imageUrl: data.imageUrl, visualizationId: data.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }), [data]);

  if (!data.imageUrl) return null;

  return (
    <div
      ref={drag as unknown as React.LegacyRef<HTMLDivElement>}
      className={`relative group cursor-move rounded-lg overflow-hidden border border-gray-200 hover:border-blue-500 transition-all duration-200 shadow-sm ${
        isDragging ? 'opacity-50 ring-2 ring-blue-400' : 'opacity-100'
      }`}
    >
      <div className="aspect-square bg-gray-100 relative">
        <img
          src={data.imageUrl}
          alt="Asset"
          className="w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 bg-white/90 p-1.5 rounded-full shadow-sm backdrop-blur-sm">
            <GripVertical className="w-4 h-4 text-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
};