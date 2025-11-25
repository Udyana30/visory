'use client';

import { useState } from 'react';
import HeroSection from './sections/HeroSection';
import ToolsGrid from './sections/ToolsGrid';
import RecentProjects from './sections/RecentProjects';
import TopBar from '../../../components/layout/TopBar';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  return (
    <div className="min-h-screen">
      <TopBar 
        showSearch={true}
        searchPlaceholder="Search in visory..."
        onSearchChange={handleSearchChange}
        showUpgrade={true}
        showNotifications={true}
      />

      <div className="px-8 py-8">
        <HeroSection />
        <ToolsGrid />
        <RecentProjects />
      </div>
    </div>
  );
}