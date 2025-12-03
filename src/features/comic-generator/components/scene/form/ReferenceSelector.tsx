import React from 'react';
import { Reference } from '../../../types/domain/reference';
import { getMentionLabel } from '../../../utils/sceneUtils';

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
      <div className="flex gap-3 overflow-x-auto px-1 pt-1 custom-scrollbar">
        {references.map(ref => {
          const isSelected = selectedIds.includes(ref.id);
          const isDisabled = !isSelected && selectedIds.length >= 2;
          const label = getMentionLabel(ref);

          return (
            <button
              key={ref.id}
              onClick={() => onToggle(ref.id)}
              disabled={isDisabled}
              className={`relative flex-shrink-0 group ${
                isSelected ? 'ring-2 ring-teal-500' : 'opacity-60 hover:opacity-100'
              } rounded-lg overflow-hidden transition disabled:opacity-30 disabled:cursor-not-allowed w-16 h-16`}
            >
              <img
                src={ref.imageUrl}
                alt={ref.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-1 py-0.5">
                <p className="text-white text-[10px] font-medium truncate">@{label}</p>
              </div>
            </button>
          );
        })}
      </div>
  );
};