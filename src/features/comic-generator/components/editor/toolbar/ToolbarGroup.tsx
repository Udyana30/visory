import React from 'react';

interface ToolbarGroupProps {
  children: React.ReactNode;
  showSeparator?: boolean;
}

export const ToolbarGroup: React.FC<ToolbarGroupProps> = ({ 
  children, 
  showSeparator = true 
}) => {
  return (
    <div className="flex items-center gap-2">
      {children}
      {showSeparator && <div className="w-px h-8 bg-gray-200 mx-2" />}
    </div>
  );
};