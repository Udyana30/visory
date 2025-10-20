"use client";

import { Paperclip, Mic } from "lucide-react";
import ToolsMenu from "./ToolsMenu";

export default function PromptInput({ 
  prompt, 
  setPrompt, 
  isFocused, 
  setIsFocused,
  showTools,
  setShowTools,
  selectedTool,
  onToolSelect
}) {
  return (
    <div className="max-w-3xl mx-auto mb-8 relative z-10">
      <div className="relative rounded-3xl backdrop-blur-xl bg-white/20 border border-white/30 shadow-[0_0_25px_rgba(255,255,255,0.2)]">
        <div className="relative rounded-3xl bg-black/40 backdrop-blur-md border border-white/30">
          <div className="p-6 min-h-[140px] relative">
            {!prompt && !isFocused && (
              <div className="absolute left-6 top-6 text-white/50 text-base md:text-lg pointer-events-none select-none">
                Describe your idea...
              </div>
            )}
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full resize-none border-none outline-none text-white bg-transparent text-base md:text-lg leading-relaxed z-10 relative"
              rows="3"
            />
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t border-white/20 relative z-20">
            <div className="flex items-center gap-3">
              <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>

              <ToolsMenu 
                showTools={showTools}
                setShowTools={setShowTools}
                selectedTool={selectedTool}
                onToolSelect={onToolSelect}
              />
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <Mic className="w-5 h-5" />
              </button>

              <button className="bg-white text-black px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2">
                <span className="text-sm font-medium">Send</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}