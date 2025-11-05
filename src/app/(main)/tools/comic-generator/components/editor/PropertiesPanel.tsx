import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { SpeechBubble, ComicPanel } from '@/types/editor';
import { BUBBLE_TEMPLATES, FONT_FAMILIES, FONT_SIZES, PAGE_LAYOUTS } from '@/lib/editorConstants';
import { ChevronDown, Sparkles } from 'lucide-react';

interface PropertiesPanelProps {
  selectedBubble: SpeechBubble | null;
  onBubbleUpdate: (bubble: SpeechBubble) => void;
  onLayoutChange: (layout: string) => void;
  currentLayout: string;
  onBubbleAdd: (panelId: string, x: number, y: number, template?: Partial<SpeechBubble>) => void;
  currentPagePanels: ComicPanel[];
  onDeselectBubble: () => void;
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
  onBubbleUpdate,
  onLayoutChange,
  currentLayout,
  onBubbleAdd,
  currentPagePanels,
  onDeselectBubble
}) => {
  const handleTemplateSelect = (template: typeof BUBBLE_TEMPLATES[0]) => {
    if (currentPagePanels.length === 0) return;
    
    const firstPanel = currentPagePanels[0];
    onBubbleAdd(firstPanel.id, 30, 30, template.style);
  };

  if (!selectedBubble) {
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
              {PAGE_LAYOUTS.map((layout) => (
                <button
                  key={layout.id}
                  onClick={() => onLayoutChange(layout.id)}
                  className={`w-full p-3 rounded-lg border transition text-left ${
                    currentLayout === layout.id
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{layout.icon}</span>
                    <span className={`text-sm font-medium ${
                      currentLayout === layout.id ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {layout.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              💡 Select a speech bubble to edit its properties, or choose a template to add a new bubble.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
};