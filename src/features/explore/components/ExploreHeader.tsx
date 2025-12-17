import React from 'react';

export const ExploreHeader: React.FC = () => {
  return (
    <div className="flex flex-col gap-2 mb-10">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Explore Community
      </h1>
      <p className="text-gray-500 text-lg max-w-2xl">
        Discover AI-generated comics created by our community. 
        Read, review, and get inspired.
      </p>
    </div>
  );
};