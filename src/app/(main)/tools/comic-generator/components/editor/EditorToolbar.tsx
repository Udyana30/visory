import React from 'react';
import { 
  Hand, 
  MessageSquare, 
  Type, 
  Image, 
  Layout, 
  Trash2, 
  ZoomIn, 
  ZoomOut,
  Undo,
  Redo,
  Download,
  Save,
  Square
} from 'lucide-react';

interface EditorToolbarProps {
  activeTool: 'select' | 'bubble' | 'text' | 'image' | 'layout' | 'custom-panel';
  onToolChange: (tool: 'select' | 'bubble' | 'text' | 'image' | 'layout' | 'custom-panel') => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onDelete: () => void;
  onExport: () => void;
  onSave: () => void;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  isSaving: boolean;
  isCustomPanelDisabled?: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  activeTool,
  onToolChange,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onDelete,
  onExport,
  onSave,
  canUndo,
  canRedo,
  zoom,
  isSaving,
  isCustomPanelDisabled = false
}) => {
  const tools = [
    { id: 'select', icon: Hand, label: 'Select', disabled: false },
    { id: 'bubble', icon: MessageSquare, label: 'Speech Bubble', disabled: false },
    { id: 'text', icon: Type, label: 'Text', disabled: false },
    { id: 'image', icon: Image, label: 'Image', disabled: false },
    { id: 'layout', icon: Layout, label: 'Layout', disabled: false },
    { id: 'custom-panel', icon: Square, label: 'Custom Panel (Select Custom Layout first)', disabled: isCustomPanelDisabled }
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {tools.map(tool => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => !tool.disabled && onToolChange(tool.id as any)}
                disabled={tool.disabled}
                className={`p-2.5 rounded-lg transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : tool.disabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
                title={tool.label}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}

          <div className="w-px h-8 bg-gray-200 mx-2"></div>

          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            title="Undo"
          >
            <Undo className="w-5 h-5" />
          </button>

          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-2.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            title="Redo"
          >
            <Redo className="w-5 h-5" />
          </button>

          <button
            onClick={onDelete}
            className="p-2.5 rounded-lg bg-gray-50 text-red-600 hover:bg-red-50 transition"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onZoomOut}
            className="p-2.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          
          <span className="text-gray-700 text-sm font-medium min-w-[60px] text-center px-3 py-2 bg-gray-50 rounded-lg">
            {Math.round(zoom * 100)}%
          </span>

          <button
            onClick={onZoomIn}
            className="p-2.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>

          <div className="w-px h-8 bg-gray-200 mx-2"></div>

          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>

          <button
            onClick={onExport}
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2 font-medium shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
    </div>
  );
};