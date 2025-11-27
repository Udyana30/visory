import React from 'react';
import { ImageLibrary } from './ImageLibrary';
import { PageList } from './PageList';
import { SceneVisualization } from '../../../types/domain/scene';

interface EditorSidebarProps {
  visualizations: SceneVisualization[];
  projectId: number | null;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({ 
  visualizations,
  projectId
}) => {
  const handleImageUpload = (files: FileList | null) => {
    console.log('Upload logic here', files);
  };

  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="flex-[6] overflow-hidden">
        <ImageLibrary 
          visualizations={visualizations} 
          onUpload={handleImageUpload} 
        />
      </div>
      
      <div className="flex-[4] overflow-hidden">
        <PageList projectId={projectId} />
      </div>
    </div>
  );
};