import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ToolbarButtonProps {
  icon: LucideIcon;
  label?: string;
  onClick: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
  variant?: 'default' | 'danger';
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  isActive = false,
  isDisabled = false,
  variant = 'default'
}) => {
  const baseClasses = "p-2.5 rounded-lg transition flex items-center justify-center";
  
  const variants = {
    default: isActive 
      ? "bg-blue-600 text-white shadow-md" 
      : "bg-gray-50 text-gray-700 hover:bg-gray-100",
    danger: "bg-gray-50 text-red-600 hover:bg-red-50"
  };

  const disabledClasses = "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400";

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      title={label}
      className={`${baseClasses} ${isDisabled ? disabledClasses : variants[variant]}`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
};