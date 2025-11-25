'use client';

import { useState, ReactNode } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';

interface MainLayoutProps {
  children: ReactNode;
}

const SIDEBAR_WIDTH = {
  collapsed: 80,
  expanded: 256,
} as const;

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const toggleSidebar = (): void => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const marginLeft = isSidebarCollapsed 
    ? SIDEBAR_WIDTH.collapsed 
    : SIDEBAR_WIDTH.expanded;

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#f5f5f5]">
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={toggleSidebar} 
        />
        <main
          className="flex-1 transition-all duration-300 ease-in-out"
          style={{ marginLeft: `${marginLeft}px` }}
        >
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}