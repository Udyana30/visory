import React from 'react';

export const TemplateSkeleton: React.FC = () => {
    return (
        <div className="aspect-[3/4] rounded-xl overflow-hidden border border-gray-100 bg-gray-50 animate-pulse">
            <div className="w-full h-full bg-gray-200" />
        </div>
    );
};
