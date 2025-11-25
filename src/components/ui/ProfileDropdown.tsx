'use client';

import { useState, useEffect, useRef } from 'react';
import { LogOut, ChevronDown, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface UserData {
  name?: string;
  email?: string;
}

export default function ProfileDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) {
    return (
      <button className="p-2.5 bg-white rounded-lg border border-gray-200">
        <User size={20} className="text-gray-600" />
      </button>
    );
  }

  const userData = user as UserData;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <div className="w-7 h-7 bg-gray-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {userData.name ? userData.name.charAt(0).toUpperCase() : '?'}
        </div>
        <span className="hidden md:inline text-sm font-medium text-gray-700">{userData.name || 'User'}</span>
        <ChevronDown size={16} className={`text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
          <div className="p-4 border-b">
            <p className="font-semibold text-sm text-gray-800 truncate">{userData.name}</p>
            <p className="text-xs text-gray-500 truncate">{userData.email}</p>
          </div>
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}