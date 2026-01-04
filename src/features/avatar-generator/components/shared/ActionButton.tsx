import React from 'react';

interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    disabled?: boolean;
    variant: 'blue' | 'red' | 'purple';
    size?: 'sm' | 'md';
}

const variantStyles = {
    blue: 'bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-400 text-gray-700 hover:text-blue-600',
    red: 'bg-white hover:bg-red-50 border-gray-200 hover:border-red-400 text-gray-700 hover:text-red-600',
    purple: 'bg-white hover:bg-purple-50 border-gray-200 hover:border-purple-400 text-gray-700 hover:text-purple-600'
};

const sizeStyles = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-3 py-2.5 text-sm'
};

export const ActionButton: React.FC<ActionButtonProps> = ({
    icon,
    label,
    onClick,
    onMouseEnter,
    onMouseLeave,
    disabled = false,
    variant,
    size = 'md'
}) => {
    return (
        <button
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            disabled={disabled}
            className={`flex items-center justify-center gap-2 border rounded-lg font-medium transition-all hover:scale-105 shadow-sm ${variantStyles[variant]} ${sizeStyles[size]}`}
        >
            {icon}
            {label}
        </button>
    );
};
