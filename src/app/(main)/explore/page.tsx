'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useExploreFeed } from '@/features/explore/hooks/useExploreFeed';
import { ExploreGrid } from '@/features/explore/components/ExploreGrid';
import { ExploreHeader } from '@/features/explore/components/ExploreHeader';

export default function ExplorePage() {
  const router = useRouter();
  const { items, isLoading } = useExploreFeed();

  const handleNavigateToDetail = (id: number) => {
    router.push(`/explore/comic/${id}`);
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-[1600px] mx-auto px-6 py-8 lg:px-10 lg:py-10">
        <ExploreHeader />
        
        <div className="mb-8">
          <div className="h-px bg-gray-100 w-full" />
        </div>

        <ExploreGrid 
          items={items} 
          isLoading={isLoading} 
          onItemClick={handleNavigateToDetail}
        />
      </div>
    </main>
  );
}