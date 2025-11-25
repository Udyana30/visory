import React from 'react';
import { 
  Hand, MessageSquare, Type, Image, Layout, Trash2, 
  ZoomIn, ZoomOut, Undo, Redo, Save, Square, ArrowLeft, Check
} from 'lucide-react';

interface EditorToolbarProps {
  activeTool: 'select' | 'bubble' | 'text' | 'image' | 'layout' | 'custom-panel';
  onToolChange: (tool: 'select' | 'bubble' | 'text' | 'image' | 'layout' | 'custom-panel') => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onDelete: () => void;
  onFinish: () => void; 
  onSave: () => void;
  onBack: () => void;
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
  onFinish,
  onSave,
  onBack,
  canUndo,
  canRedo,
  zoom,
  isSaving,
  isCustomPanelDisabled = false,
}) => {
  const tools = [
    { id: 'select', icon: Hand, label: 'Select', disabled: false },
    { id: 'bubble', icon: MessageSquare, label: 'Speech Bubble', disabled: false },
    { id: 'text', icon: Type, label: 'Text', disabled: false },
    { id: 'image', icon: Image, label: 'Image', disabled: false },
    { id: 'layout', icon: Layout, label: 'Layout', disabled: false },
    { id: 'custom-panel', icon: Square, label: 'Custom Panel', disabled: isCustomPanelDisabled }
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm z-20 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition" title="Back">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-px h-8 bg-gray-200 mx-2"></div>
          {tools.map(tool => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => !tool.disabled && onToolChange(tool.id as any)}
                disabled={tool.disabled}
                className={`p-2.5 rounded-lg transition ${
                  activeTool === tool.id
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
          <button onClick={onUndo} disabled={!canUndo} className="p-2.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition">
            <Undo className="w-5 h-5" />
          </button>
          <button onClick={onRedo} disabled={!canRedo} className="p-2.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition">
            <Redo className="w-5 h-5" />
          </button>
          <button onClick={onDelete} className="p-2.5 rounded-lg bg-gray-50 text-red-600 hover:bg-red-50 transition">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onZoomOut} className="p-2.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition">
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-gray-700 text-sm font-medium min-w-[60px] text-center px-3 py-2 bg-gray-50 rounded-lg">
            {Math.round(zoom * 100)}%
          </span>
          <button onClick={onZoomIn} className="p-2.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition">
            <ZoomIn className="w-5 h-5" />
          </button>
          <div className="w-px h-8 bg-gray-200 mx-2"></div>
          <button
            onClick={onSave}
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
            Finish & Review
          </button>
        </div>
      </div>
    </div>
  );
};