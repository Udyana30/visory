import React from 'react';
import { Plus } from 'lucide-react';
import { Reference } from '../../types/domain/reference';
import { ReferenceCard } from './ReferenceCard';

interface ReferenceGridProps {
  title: string;
  description: string;
  items: Reference[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onAdd: () => void;
  isLoading: boolean;
  emptyMessage: string;
}

export const ReferenceGrid: React.FC<ReferenceGridProps> = ({
  title,
  description,
  items,
  selectedIds,
  onSelect,
  onAdd,
  isLoading,
  emptyMessage
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            {title}
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
              {items.length}
            </span>
          </h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <button
          onClick={onAdd}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      {items.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50/50">
          <p className="text-sm text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <ReferenceCard
              key={item.id}
              data={item}
              isSelected={selectedIds.includes(item.id)}
              onSelect={() => onSelect(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};