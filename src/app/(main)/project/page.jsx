'use client';

import { useState } from 'react';
import { Search, Bell } from 'lucide-react';
import ProfileDropdown from '@/components/ui/ProfileDropdown';
import ProjectHeader from './sections/ProjectHeader';
import ProjectList from './sections/ProjectList';

export default function ProjectPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 bg-[#f5f5f5] border-b border-gray-200">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search in visory..."
                className="w-full pl-12 pr-4 py-2.5 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 ml-6">
            <button className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
              Upgrade
            </button>
            <button className="p-2.5 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <Bell size={20} className="text-gray-600" />
            </button>
            <ProfileDropdown />
          </div>
        </div>
      </header>

      <div className="px-8 py-8">
        <ProjectHeader 
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter} 
        />
        <ProjectList filter={activeFilter} />
      </div>
    </div>
  );
}