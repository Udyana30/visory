import React from 'react';
import { Layers, User, Mountain } from 'lucide-react';
import { Reference } from '../../types/domain/reference';
import { ReferenceCard } from './ReferenceCard';

interface ReferenceGridProps {
  title?: string;
  description?: string;
  items: Reference[];
  type: 'character' | 'background';
  selectedIds?: string[];
  onSelect?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  emptyMessage?: string;
}

export const ReferenceGrid: React.FC<ReferenceGridProps> = ({
  title,
  description,
  items,
  type,
  selectedIds = [],
  onSelect,
  onEdit,
  onDelete,
  emptyMessage
}) => {
  const gridCols = type === 'character' 
    ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5' 
    : 'grid-cols-1 md:grid-cols-3';

  const Icon = type === 'character' ? User : Mountain;

  return (
    <div className="space-y-6">
      {(title || description) && (
        <div className="flex flex-col gap-1">
          {title && (
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
                {title}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                {items.length}
              </span>
            </div>
          )}
          {description && (
            <p className="text-sm text-gray-500 font-light max-w-2xl">
              {description}
            </p>
          )}
        </div>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 px-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-center transition-colors hover:bg-gray-50">
          <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center mb-3">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">No {type}s found</p>
        </div>
      ) : (
        <div className={`grid gap-5 ${gridCols}`}>
          {items.map((item) => (
            <ReferenceCard
              key={item.id}
              data={item}
              isSelected={selectedIds.includes(item.id)}
              onSelect={() => onSelect?.(item.id)}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};