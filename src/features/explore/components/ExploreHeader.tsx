'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown } from 'lucide-react';

interface ExploreHeaderProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  { value: 'All', label: 'All Projects' },
  { value: 'Comics', label: 'Comics' },
  { value: 'Avatars', label: 'Avatars' }
];

export const ExploreHeader: React.FC<ExploreHeaderProps> = ({ activeFilter, onFilterChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const activeFilterLabel = filters.find(f => f.value === activeFilter)?.label || 'All Projects';

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Explore Community
          </h1>
          <p className="text-gray-500 text-base mt-2">
            Discover inspiring creations from our community
          </p>
        </div>

        {/* Filter Dropdown Button */}
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Filter size={20} />
            {activeFilterLabel}
            <ChevronDown
              size={18}
              className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50"
            >
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => {
                    onFilterChange(filter.value);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center justify-between ${activeFilter === filter.value
                      ? 'bg-gray-50 text-gray-900 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <span>{filter.label}</span>
                  {activeFilter === filter.value && (
                    <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};