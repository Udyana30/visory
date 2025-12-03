import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Trash2 } from 'lucide-react';
import { ComicPage } from '../../../types/domain/editor';

interface PageThumbnailProps {
  page: ComicPage;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  onDropComplete: () => void;
  canDelete: boolean;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const PageThumbnail: React.FC<PageThumbnailProps> = ({
  page,
  index,
  isActive,
  onSelect,
  onDelete,
  onMove,
  onDropComplete,
  canDelete
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'PAGE',
    item: { type: 'PAGE', id: page.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        onDropComplete();
      }
    }
  });

  const [, drop] = useDrop({
    accept: 'PAGE',
    hover(item: DragItem, monitor) {
      if (!ref.current) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientX = (clientOffset as any).x - hoverBoundingRect.left;

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;

      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      onClick={onSelect}
      className={`relative group cursor-pointer flex-shrink-0 rounded-lg border-2 transition-all duration-200 ${
        isActive
          ? 'border-blue-500 bg-blue-50 shadow-md ring-1 ring-blue-200'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      } ${isDragging ? 'opacity-0' : 'opacity-100'}`}
      style={{ height: '140px', minWidth: '100px' }}
    >
      <div className="w-full h-full flex items-center justify-center relative overflow-hidden rounded-md">
        <span className={`text-2xl font-bold ${isActive ? 'text-blue-200' : 'text-gray-100'}`}>
          {index + 1}
        </span>
        
        {page.previewUrl && (
          <img 
            src={page.previewUrl} 
            alt={`Page ${index + 1}`} 
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
        )}
      </div>

      <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
        {index + 1}
      </div>

      {canDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-1 right-1 p-1.5 bg-red-100 text-red-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200 shadow-sm"
          title="Delete Page"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};