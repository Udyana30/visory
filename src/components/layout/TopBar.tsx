'use client';

import { Search, Bell } from 'lucide-react';
import ProfileDropdown from '../ui/ProfileDropdown';
import PageHeader from '../ui/PageHeader';

interface TopBarProps {
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  showUpgrade?: boolean;
  showNotifications?: boolean;
  className?: string;
  pageTitle?: string;
  pageSubtitle?: string | React.ReactNode;
}

export default function TopBar({
  showSearch = false,
  searchPlaceholder = 'Search...',
  onSearchChange,
  showUpgrade = true,
  showNotifications = true,
  className = '',
  pageTitle,
  pageSubtitle,
}: TopBarProps) {
  return (
    <header className={`sticky top-0 z-40 bg-gray-50 ${className}`}>
      <div className="mx-auto">
        <div className="flex items-start justify-between px-15 py-8">
          {showSearch ? (
            <div className="flex-1 max-w-md pt-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-white rounded-lg border border-gray-200 focus:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          ) : pageTitle ? (
            <PageHeader
              title={pageTitle}
              subtitle={pageSubtitle}
              className="mb-0 flex-1"
            />
          ) : (
            <div className="flex-1" />
          )}

          <div className="flex items-center gap-3 pt-1">
            {showUpgrade && (
              <button className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                Upgrade
              </button>
            )}
            
            {showNotifications && (
              <button className="p-2.5 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Bell size={20} className="text-gray-600" />
              </button>
            )}
            
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}