'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';
import { 
  Home, 
  Compass, 
  FolderKanban, 
  Video, 
  User, 
  Image, 
  Mic, 
  MessageSquare,
  HelpCircle
} from 'lucide-react';

interface NavigationItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navigationItems: NavigationItem[] = [
  { icon: Home, label: 'Home', href: '/home' },
  { icon: Compass, label: 'Explore', href: '/explore' },
  { icon: FolderKanban, label: 'Project', href: '/project' },
];

const toolsItems: NavigationItem[] = [
  { icon: Video, label: 'Video Generator', href: '/tools/video' },
  { icon: User, label: 'Avatar Generator', href: '/tools/avatar-generator' },
  { icon: Image, label: 'Comic Generator', href: '/tools/comic-generator' },
  { icon: MessageSquare, label: 'Text to Speech', href: '/tools/text-to-speech' },
  { icon: Mic, label: 'Speech to Text', href: '/tools/speech-to-text' },
];

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  
  const isActive = (href: string): boolean => pathname === href;

  const renderNavItem = (item: NavigationItem) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
          active
            ? 'bg-[#2a2a2a] text-white'
            : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
        } ${isCollapsed ? 'justify-center' : ''}`}
        title={isCollapsed ? item.label : ''}
      >
        <Icon size={20} className="flex-shrink-0" />
        {!isCollapsed && (
          <span className="text-sm font-medium whitespace-nowrap">
            {item.label}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside 
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-[#1a1a1a] text-white h-screen flex flex-col fixed left-0 top-0 transition-all duration-300 ease-in-out z-50 overflow-x-hidden`}
    >
      <div className="px-6 pt-8 pb-6 flex items-center gap-2">
        {!isCollapsed && (
          <h1 className="text-2xl font-bold">visory</h1>
        )}
        
        <button 
          onClick={onToggle}
          className={`${
            isCollapsed ? 'mx-auto' : 'ml-auto'
          } p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors`}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 px-4 pt-4 overflow-y-auto overflow-x-hidden">
        <div className="space-y-1">
          {navigationItems.map(renderNavItem)}
        </div>

        <div className="mt-8">
          {!isCollapsed && (
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              TOOLS
            </h3>
          )}
          {isCollapsed && (
            <div className="h-px bg-[#2a2a2a] mx-4 mb-3" />
          )}
          <div className="space-y-1">
            {toolsItems.map(renderNavItem)}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-[#2a2a2a]">
        <Link
          href="/help"
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-[#2a2a2a] hover:text-white transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Help Center' : ''}
        >
          <HelpCircle size={20} className="flex-shrink-0" />
          {!isCollapsed && (
            <span className="text-sm font-medium whitespace-nowrap">
              Help Center
            </span>
          )}
        </Link>
      </div>
    </aside>
  );
}