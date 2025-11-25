import React from 'react';
import { StoryData } from '@/app/(main)/tools/comic-generator/types/comic';

interface VisualizationHeaderProps {
  storyData: StoryData;
}

export const VisualizationHeader: React.FC<VisualizationHeaderProps> = ({ storyData }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Story Visualization</h2>
      <p className="text-gray-600 mb-6">
        Bring your story to life with scene-by-scene visual generation. Adjust style, perspective, and mood for each panel before rendering your comic.
      </p>

      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{storyData.title}</h3>
        <p className="text-gray-700 leading-relaxed">{storyData.overview}</p>
      </div>
    </div>
  );
};