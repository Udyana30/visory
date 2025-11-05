import React from 'react';
import { useDrag } from 'react-dnd';
import { SceneVisualization } from '@/types/editor';
import { GripVertical, Upload } from 'lucide-react';

interface ImageGalleryProps {
  visualizations: SceneVisualization[];
  onImageUpload: (files: FileList | null) => void;
}

interface DraggableImageProps {
  visualization: SceneVisualization;
}

const DraggableImage: React.FC<DraggableImageProps> = ({ visualization }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'image',
    item: { imageUrl: visualization.imageUrl, visualizationId: visualization.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  if (!visualization.imageUrl) return null;

  return (
    <div
      ref={drag as any}
      className={`relative group cursor-move rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="aspect-video bg-gray-100">
        <img
          src={visualization.imageUrl}
          alt={`Scene ${visualization.sceneId}`}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
        <GripVertical className="w-6 h-6 text-white" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
        <p className="text-xs text-white truncate font-medium">Scene {visualization.sceneId}</p>
      </div>
    </div>
  );
};

export const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  visualizations,
  onImageUpload 
}) => {
  const validVisualizations = visualizations.filter(v => v.imageUrl);

  return (
    <div className="border-b border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Scene Images</h3>
        <label className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition cursor-pointer">
          <Upload className="w-4 h-4" />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => onImageUpload(e.target.files)}
            className="hidden"
          />
        </label>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        Drag images to panels
      </p>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {validVisualizations.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-xs">No images available</p>
          </div>
        ) : (
          validVisualizations.map((viz) => (
            <DraggableImage key={viz.id} visualization={viz} />
          ))
        )}
      </div>
    </div>
  );
};