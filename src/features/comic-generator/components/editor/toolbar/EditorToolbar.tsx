import React from 'react';
import { 
  Hand, MessageSquare, Type, Image, Layout, Trash2, 
  ZoomIn, ZoomOut, Undo, Redo, Save, Square, ArrowLeft, Check
} from 'lucide-react';
import { useEditorActions } from '../../../hooks/useEditorActions';
import { useEditor } from '../../../context/EditorContext';
import { ToolbarButton } from './ToolbarButton';
import { ToolbarGroup } from './ToolbarGroup';
import { EditorTool } from '../../../types/domain/editor';

interface EditorToolbarProps {
  onBack: () => void;
  onFinish: () => void;
  projectId: number | null;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ 
  onBack, 
  onFinish, 
  projectId 
}) => {
  const { state } = useEditor();
  const {
    setTool, undo, redo, zoomIn, zoomOut, deleteSelected, saveCurrentPage
  } = useEditorActions();

  const { activeTool, zoom, isSaving, history, pages, activePageIndex } = state;
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;
  const isCustomLayout = pages[activePageIndex]?.layout === 'custom';

  const tools = [
    { id: 'select', icon: Hand, label: 'Select', disabled: false },
    { id: 'bubble', icon: MessageSquare, label: 'Bubble', disabled: false },
    { id: 'text', icon: Type, label: 'Text', disabled: true },
    { id: 'image', icon: Image, label: 'Image', disabled: true },
    { id: 'layout', icon: Layout, label: 'Layout', disabled: true },
    { id: 'custom-panel', icon: Square, label: 'Draw Panel', disabled: !isCustomLayout }
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm z-20 relative flex justify-between">
      <div className="flex items-center">
        <ToolbarGroup>
          <ToolbarButton icon={ArrowLeft} onClick={onBack} label="Back" />
        </ToolbarGroup>

        <ToolbarGroup>
          {tools.map((tool) => (
            <ToolbarButton
              key={tool.id}
              icon={tool.icon as any}
              label={tool.label}
              isActive={activeTool === tool.id}
              isDisabled={tool.disabled}
              onClick={() => setTool(tool.id as EditorTool)}
            />
          ))}
        </ToolbarGroup>

        <ToolbarGroup showSeparator={false}>
          <ToolbarButton icon={Undo} onClick={undo} isDisabled={!canUndo} label="Undo" />
          <ToolbarButton icon={Redo} onClick={redo} isDisabled={!canRedo} label="Redo" />
          <ToolbarButton icon={Trash2} onClick={deleteSelected} variant="danger" label="Delete" />
        </ToolbarGroup>
      </div>

      <div className="flex items-center">
        <ToolbarGroup>
          <ToolbarButton icon={ZoomOut} onClick={zoomOut} label="Zoom Out" />
          <span className="text-gray-700 text-sm font-medium min-w-[60px] text-center px-3 py-2 bg-gray-50 rounded-lg">
            {Math.round(zoom * 100)}%
          </span>
          <ToolbarButton icon={ZoomIn} onClick={zoomIn} label="Zoom In" />
        </ToolbarGroup>

        <div className="flex items-center gap-2">
          <button
            onClick={() => projectId && saveCurrentPage(projectId)}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition flex items-center gap-2 font-medium disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          
          <button
            onClick={onFinish}
            className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2 font-bold shadow-lg shadow-blue-600/20"
          >
            <Check className="w-4 h-4" />
            Finish
          </button>
        </div>
      </div>
    </div>
  );
};