import React from 'react';
import { Reference } from '../../types/domain/reference';
import { getMentionLabel } from '../../utils/sceneUtils';

interface ReferenceSelectorProps {
  references: Reference[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export const ReferenceSelector: React.FC<ReferenceSelectorProps> = ({
  references,
  selectedIds,
  onToggle
}) => {
  if (references.length === 0) return null;

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-800 mb-3">
        Active References (Mentions)
      </label>
      <div className="flex flex-wrap gap-3">
        {references.map(ref => {
          const isSelected = selectedIds.includes(ref.id);
          const isDisabled = !isSelected && selectedIds.length >= 2;
          const label = getMentionLabel(ref);

          return (
            <button
              key={ref.id}
              onClick={() => onToggle(ref.id)}
              disabled={isDisabled}
              className={`relative group ${
                isSelected ? 'ring-2 ring-teal-500' : 'opacity-60 hover:opacity-100'
              } rounded-lg overflow-hidden transition disabled:opacity-30 disabled:cursor-not-allowed w-20 h-20`}
            >
              <img
                src={ref.imageUrl}
                alt={ref.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1">
                <p className="text-white text-xs font-medium truncate">@{label}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};