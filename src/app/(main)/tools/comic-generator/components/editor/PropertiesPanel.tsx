import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { SpeechBubble, ComicPanel } from '@/types/editor';
import { BUBBLE_TEMPLATES, FONT_FAMILIES, FONT_SIZES, PAGE_LAYOUTS } from '@/lib/editorConstants';
import { ChevronDown, Sparkles, Trash2 } from 'lucide-react';

interface PropertiesPanelProps {
  selectedBubble: SpeechBubble | null;
  selectedPanel: ComicPanel | null;
  onBubbleUpdate: (bubble: SpeechBubble) => void;
  onPanelUpdate: (panel: ComicPanel) => void;
  onLayoutChange: (layout: string) => void;
  currentLayout: string;
  onBubbleAdd: (panelId: string, x: number, y: number, template?: Partial<SpeechBubble>) => void;
  currentPagePanels: ComicPanel[];
  onDeselectBubble: () => void;
  onDeselectPanel: () => void;
}

const ColorPickerDropdown: React.FC<{
  label: string;
  color: string;
  onChange: (color: string) => void;
}> = ({ label, color, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between transition"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded border border-gray-300"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm">{color}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 mt-2 p-3 bg-white rounded-lg shadow-xl border border-gray-200">
            <HexColorPicker color={color} onChange={onChange} />
            <input
              type="text"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="mt-2 w-full px-2 py-1 bg-gray-50 border border-gray-300 rounded text-gray-900 text-sm"
              placeholder="#000000"
            />
          </div>
        </>
      )}
    </div>
  );
};

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedBubble,
  selectedPanel,
  onBubbleUpdate,
  onPanelUpdate,
  onLayoutChange,
  currentLayout,
  onBubbleAdd,
  currentPagePanels,
  onDeselectBubble,
  onDeselectPanel
}) => {
  const handleTemplateSelect = (template: typeof BUBBLE_TEMPLATES[0]) => {
    if (currentPagePanels.length === 0) return;
    
    const firstPanel = currentPagePanels[0];
    onBubbleAdd(firstPanel.id, 30, 30, template.style);
  };

  if (selectedPanel && currentLayout === 'custom') {
    return (
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Panel Properties</h3>
          <button
            onClick={onDeselectPanel}
            className="text-xs text-gray-600 hover:text-gray-900 underline"
          >
            Deselect
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800 mb-2">
              <strong>📐 Custom Panel Selected</strong>
            </p>
            <p className="text-xs text-green-700">
              Drag to move, use corner handles to resize
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Position X</label>
            <input
              type="number"
              value={Math.round(selectedPanel.x)}
              onChange={(e) => onPanelUpdate({ 
                ...selectedPanel, 
                x: Math.max(0, Math.min(100 - selectedPanel.width, Number(e.target.value)))
              })}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900"
              min="0"
              max={100 - selectedPanel.width}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Position Y</label>
            <input
              type="number"
              value={Math.round(selectedPanel.y)}
              onChange={(e) => onPanelUpdate({ 
                ...selectedPanel, 
                y: Math.max(0, Math.min(100 - selectedPanel.height, Number(e.target.value)))
              })}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900"
              min="0"
              max={100 - selectedPanel.height}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Width (%)</label>
            <input
              type="number"
              value={Math.round(selectedPanel.width)}
              onChange={(e) => onPanelUpdate({ 
                ...selectedPanel, 
                width: Math.max(10, Math.min(100 - selectedPanel.x, Number(e.target.value)))
              })}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900"
              min="10"
              max={100 - selectedPanel.x}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Height (%)</label>
            <input
              type="number"
              value={Math.round(selectedPanel.height)}
              onChange={(e) => onPanelUpdate({ 
                ...selectedPanel, 
                height: Math.max(10, Math.min(100 - selectedPanel.y, Number(e.target.value)))
              })}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900"
              min="10"
              max={100 - selectedPanel.y}
            />
          </div>

          {selectedPanel.imageUrl && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Current Image:</p>
              <img 
                src={selectedPanel.imageUrl} 
                alt="Panel preview" 
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (selectedBubble) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Bubble Properties</h3>
          <button
            onClick={onDeselectBubble}
            className="text-xs text-gray-600 hover:text-gray-900 underline"
          >
            Deselect
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={selectedBubble.type}
              onChange={(e) =>
                onBubbleUpdate({ ...selectedBubble, type: e.target.value as any })
              }
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              {BUBBLE_TEMPLATES.map((template) => (
                <option key={template.id} value={template.style.type}>
                  {template.icon} {template.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Text</label>
            <textarea
              value={selectedBubble.text}
              onChange={(e) =>
                onBubbleUpdate({ ...selectedBubble, text: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
              placeholder="Enter text..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Family
            </label>
            <select
              value={selectedBubble.fontFamily}
              onChange={(e) =>
                onBubbleUpdate({ ...selectedBubble, fontFamily: e.target.value })
              }
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              {FONT_FAMILIES.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Size
            </label>
            <select
              value={selectedBubble.fontSize}
              onChange={(e) =>
                onBubbleUpdate({ ...selectedBubble, fontSize: parseInt(e.target.value) })
              }
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              {FONT_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}px
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Align
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['left', 'center', 'right'].map((align) => (
                <button
                  key={align}
                  onClick={() =>
                    onBubbleUpdate({ ...selectedBubble, textAlign: align as any })
                  }
                  className={`py-2 rounded-lg border transition capitalize font-medium ${
                    selectedBubble.textAlign === align
                      ? 'border-blue-500 bg-blue-600 text-white shadow-sm'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>

          <ColorPickerDropdown
            label="Text Color"
            color={selectedBubble.color}
            onChange={(color) => onBubbleUpdate({ ...selectedBubble, color })}
          />

          <ColorPickerDropdown
            label="Background Color"
            color={selectedBubble.backgroundColor}
            onChange={(backgroundColor) =>
              onBubbleUpdate({ ...selectedBubble, backgroundColor })
            }
          />

          <ColorPickerDropdown
            label="Border Color"
            color={selectedBubble.borderColor}
            onChange={(borderColor) => onBubbleUpdate({ ...selectedBubble, borderColor })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Border Width
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={selectedBubble.borderWidth}
              onChange={(e) =>
                onBubbleUpdate({
                  ...selectedBubble,
                  borderWidth: parseInt(e.target.value)
                })
              }
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0px</span>
              <span className="font-medium text-gray-700">{selectedBubble.borderWidth}px</span>
              <span>10px</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-900">Properties</h3>
      </div>

      <div className="p-4 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-semibold text-gray-900">Bubble Templates</h4>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {BUBBLE_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className="p-3 rounded-lg border border-gray-200 bg-white hover:border-blue-500 hover:bg-blue-50 transition text-center group"
                title={template.preview}
              >
                <span className="text-2xl mb-1 block">{template.icon}</span>
                <span className="text-xs font-medium text-gray-700 group-hover:text-blue-700">
                  {template.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Page Layout</h4>
          <div className="space-y-2">

          <button
              onClick={() => onLayoutChange('custom')}
              className={`w-full p-3 rounded-lg border transition text-left ${
                currentLayout === 'custom'
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">⊞</span>
                <span className={`text-sm font-medium ${
                  currentLayout === 'custom' ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  Custom Layout
                </span>
              </div>
            </button>

            <button
              onClick={() => onLayoutChange('single')}
              className={`w-full p-3 rounded-lg border transition text-left ${
                currentLayout === 'single'
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">□</span>
                <span className={`text-sm font-medium ${
                  currentLayout === 'single' ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  Single Panel
                </span>
              </div>
            </button>

            <button
              onClick={() => onLayoutChange('double')}
              className={`w-full p-3 rounded-lg border transition text-left ${
                currentLayout === 'double'
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">⬚⬚</span>
                <span className={`text-sm font-medium ${
                  currentLayout === 'double' ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  Double Panel
                </span>
              </div>
            </button>
           
            <button
              onClick={() => onLayoutChange('triple')}
              className={`w-full p-3 rounded-lg border transition text-left ${
                currentLayout === 'triple'
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">⬚⬚⬚</span>
                <span className={`text-sm font-medium ${
                  currentLayout === 'triple' ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  Triple Panel
                </span>
              </div>
            </button>

            <button
              onClick={() => onLayoutChange('quad')}
              className={`w-full p-3 rounded-lg border transition text-left ${
                currentLayout === 'quad'
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">⬚⬚⬚⬚</span>
                <span className={`text-sm font-medium ${
                  currentLayout === 'quad' ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  Quad Panel
                </span>
              </div>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};