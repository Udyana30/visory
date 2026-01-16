'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExploreFeed } from '@/features/explore/hooks/useExploreFeed';
import { ExploreGrid } from '@/features/explore/components/ExploreGrid';
import { ExploreHeader } from '@/features/explore/components/ExploreHeader';
import TopBar from '@/components/layout/TopBar';

export default function ExplorePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const { items, isLoading } = useExploreFeed();

  const handleNavigateToDetail = (id: number) => {
    router.push(`/explore/comic/${id}`);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  // Filter items based on search query and active filter
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    // For now, all items are comics (filter logic ready for future expansion)
    const matchesFilter = activeFilter === 'All' || activeFilter === 'Comics';
    return matchesSearch && matchesFilter;
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <TopBar
        showSearch={true}
        searchPlaceholder="Search community..."
        onSearchChange={handleSearchChange}
        showUpgrade={true}
        showNotifications={true}
      />

      <div className="max-w-[1600px] mx-auto px-15 py-8">
        <ExploreHeader
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <div className="mb-8">
          <div className="h-px bg-gray-200 w-full" />
        </div>

        <ExploreGrid
          items={filteredItems}
          isLoading={isLoading}
          onItemClick={handleNavigateToDetail}
        />
      </div>
    </main>
  );
}