import React from 'react';
import { SceneVisualization } from '../../../types/domain/scene';
import { SceneThumbnailCard } from '../card/SceneThumbnailCard';

interface SceneGridViewProps {
  isOpen: boolean;
  scenes: SceneVisualization[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
  onDelete: (index: number) => void;
}

export const SceneGridView: React.FC<SceneGridViewProps> = ({
  isOpen,
  scenes,
  activeId,
  onSelect,
  onClose,
  onDelete
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-gray-50/95 backdrop-blur-md flex flex-col animate-in fade-in zoom-in-95 duration-200">
      <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-gray-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto pt-8 pb-20">
          {scenes.map((scene, index) => (
            <div key={scene.id} className="flex flex-col gap-3 group">
              <SceneThumbnailCard
                scene={scene}
                index={index}
                isActive={scene.id === activeId}
                onClick={() => {
                  onSelect(scene.id);
                  onClose();
                }}
                onDelete={(e) => {
                  e.stopPropagation();
                  onDelete(index);
                }}
              />
              <div className="flex justify-between items-center px-1">
                <span className="text-sm font-semibold text-gray-500 group-hover:text-gray-900 transition-colors">
                  Scene {index + 1}
                </span>
                {scene.imageUrl && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                      Generated
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};