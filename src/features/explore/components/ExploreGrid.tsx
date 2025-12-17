import React from 'react';
import { ComicCard } from './cards/ComicCard';
import { ComicCardSkeleton } from './cards/ComicCardSkeleton';
import { ComicGalleryItem } from '../types/domain';
import { Layers } from 'lucide-react';

interface ExploreGridProps {
  items: ComicGalleryItem[];
  isLoading: boolean;
  onItemClick: (id: number) => void;
}

export const ExploreGrid: React.FC<ExploreGridProps> = ({ items, isLoading, onItemClick }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
        {Array.from({ length: 10 }).map((_, i) => (
          <ComicCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="bg-gray-50 p-4 rounded-full mb-4">
          <Layers size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No comics found</h3>
        <p className="text-gray-500 max-w-sm mt-1">
          Be the first to publish a comic or try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
      {items.map((item) => (
        <ComicCard 
          key={item.id} 
          data={item} 
          onClick={onItemClick} 
        />
      ))}
    </div>
  );
};