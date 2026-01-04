'use client';

import React from 'react';
import { LayoutGrid } from 'lucide-react';

interface TemplateModalTriggerProps {
    onClick: () => void;
    disabled?: boolean;
}

export const TemplateModalTrigger: React.FC<TemplateModalTriggerProps> = ({
    onClick,
    disabled
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center border border-blue-200"
        >
            <LayoutGrid className="w-4 h-4" />
            Choose from Templates
        </button>
    );
};
