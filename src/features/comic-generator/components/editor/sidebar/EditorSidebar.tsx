import React from 'react';
import { ImageLibrary } from './ImageLibrary';
import { PageList } from './PageList';
import { SceneVisualization } from '../../../types/domain/scene';

interface EditorSidebarProps {
  visualizations: SceneVisualization[];
  projectId: number | null;
  onUpload: (files: FileList | null) => void;
  uploadingIds?: Set<string>;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  visualizations,
  projectId,
  onUpload,
  uploadingIds = new Set()
}) => {
  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="flex-[6] overflow-hidden">
        <ImageLibrary
          visualizations={visualizations}
          onUpload={onUpload}
          uploadingIds={uploadingIds}
        />
      </div>

      <div className="flex-[4] overflow-hidden">
        <PageList projectId={projectId} />
      </div>
    </div>
  );
};