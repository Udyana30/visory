import React, { useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { SceneVisualization } from '../../../types/domain/scene';
import { SceneThumbnailCard } from '../card/SceneThumbnailCard';

interface SceneFilmstripProps {
  scenes: SceneVisualization[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (index: number) => void;
}

export const SceneFilmstrip: React.FC<SceneFilmstripProps> = ({
  scenes,
  activeId,
  onSelect,
  onAdd,
  onDelete
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeId && scrollRef.current) {
      const activeElement = document.getElementById(`thumbnail-${activeId}`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeId]);

  return (
    <div className="h-full w-full flex flex-col bg-white overflow-hidden">
      <div className="p-3 border-b border-gray-100 bg-gray-50/50 shrink-0">
        <button
          onClick={onAdd}
          className="w-full aspect-video rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-teal-500 hover:text-teal-500 hover:bg-teal-50 transition-all gap-1 group bg-white"
        >
          <div className="w-6 h-6 rounded-full bg-gray-100 group-hover:bg-teal-100 flex items-center justify-center transition-colors">
            <Plus className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-medium">New Scene</span>
        </button>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3 custom-scrollbar"
      >
        {scenes.map((scene, index) => (
          <div key={scene.id} id={`thumbnail-${scene.id}`} className="w-full">
            <SceneThumbnailCard
              scene={scene}
              index={index}
              isActive={scene.id === activeId}
              onClick={() => onSelect(scene.id)}
              onDelete={(e) => {
                e.stopPropagation();
                onDelete(index);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};