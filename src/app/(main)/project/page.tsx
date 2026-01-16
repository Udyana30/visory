'use client';

import { useState } from 'react';
import TopBar from '@/components/layout/TopBar';
import ProjectHeader from './sections/ProjectHeader';
import ProjectList from './sections/ProjectList';

export default function ProjectPage() {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        showSearch={true}
        searchPlaceholder="Search projects..."
        onSearchChange={handleSearchChange}
        showUpgrade={true}
        showNotifications={true}
      />

      <div className="max-w-[1600px] mx-auto px-15 py-8">
        <ProjectHeader
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <ProjectList filter={activeFilter} />
      </div>
    </div>
  );
}
