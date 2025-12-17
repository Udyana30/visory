import React from 'react';

export const ComicCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-3 w-full animate-pulse">
      <div className="aspect-[3/4] w-full rounded-xl bg-gray-200" />
      <div className="space-y-2">
        <div className="h-5 w-3/4 bg-gray-200 rounded" />
        <div className="flex gap-2">
          <div className="h-4 w-12 bg-gray-200 rounded" />
          <div className="h-4 w-12 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};