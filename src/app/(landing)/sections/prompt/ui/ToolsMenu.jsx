"use client";

import { Image, Video, Mic, User, ChevronDown } from "lucide-react";

const TOOL_OPTIONS = [
  { icon: Image, label: "Image", value: "image" },
  { icon: Video, label: "Video", value: "video" },
  { icon: Mic, label: "Voice", value: "voice" },
  { icon: User, label: "Avatar", value: "avatar" }
];

export default function ToolsMenu({ showTools, setShowTools, selectedTool, onToolSelect }) {
  const getSelectedToolIcon = () => {
    if (!selectedTool) return null;
    const tool = TOOL_OPTIONS.find(t => t.value === selectedTool);
    return tool ? tool.icon : null;
  };

  const SelectedIcon = getSelectedToolIcon();

  return (
    <div className="relative">
      <button
        onClick={() => setShowTools((prev) => !prev)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all border ${
          selectedTool 
            ? "bg-white text-black border-white" 
            : "text-white/70 hover:text-white hover:bg-white/10 border-white/30"
        }`}
      >
        {SelectedIcon ? (
          <>
            <SelectedIcon className="w-4 h-4" />
            <span className="text-sm font-medium">
              {TOOL_OPTIONS.find(t => t.value === selectedTool)?.label}
            </span>
          </>
        ) : (
          <span className="text-sm">Tools</span>
        )}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${showTools ? "rotate-180" : ""}`}
        />
      </button>

      {showTools && (
        <div className="absolute top-full left-0 mt-2 bg-gray-800/95 backdrop-blur-xl border border-white/30 rounded-xl overflow-hidden shadow-2xl min-w-[160px] z-[100]">
          {TOOL_OPTIONS.map(({ icon: Icon, label, value }) => (
            <button
              key={value}
              onClick={() => onToolSelect(value)}
              className={`flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 w-full text-left transition-colors ${
                selectedTool === value ? "bg-white/10" : ""
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
