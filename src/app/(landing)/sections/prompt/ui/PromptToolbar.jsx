"use client";
import { useState } from "react";
import { Paperclip, Image, Video, Mic, User, ChevronDown } from "lucide-react";
import { MODEL_LIST } from "../data";

export default function PromptToolbar({ prompt, setPrompt }) {
  const [showTools, setShowTools] = useState(false);
  const [showModels, setShowModels] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODEL_LIST[0]);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-white/20">
      <div className="flex items-center gap-3">
        <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition">
          <Paperclip className="w-5 h-5" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowTools(!showTools)}
            className="flex items-center gap-2 px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <span className="text-sm">Tools</span>
            <ChevronDown className={`w-4 h-4 ${showTools ? "rotate-180" : ""}`} />
          </button>
          {showTools && (
            <div className="absolute mt-2 bg-black/90 backdrop-blur-xl border border-white/30 rounded-xl overflow-hidden shadow-2xl z-50">
              {[
                { icon: Image, label: "Image" },
                { icon: Video, label: "Video" },
                { icon: Mic, label: "Voice" },
                { icon: User, label: "Avatar" },
              ].map(({ icon: Icon, label }) => (
                <button key={label} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 w-full text-left">
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowModels(!showModels)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg border border-white/20 transition"
          >
            <span className="text-sm font-medium">{selectedModel}</span>
            <ChevronDown className={`w-4 h-4 ${showModels ? "rotate-180" : ""}`} />
          </button>
          {showModels && (
            <div className="absolute right-0 mt-2 bg-black/90 backdrop-blur-xl border border-white/30 rounded-xl overflow-hidden shadow-2xl min-w-[180px] z-50">
              {MODEL_LIST.map((model) => (
                <button
                  key={model}
                  onClick={() => {
                    setSelectedModel(model);
                    setShowModels(false);
                  }}
                  className={`px-4 py-3 text-white hover:bg-white/10 w-full text-left text-sm ${
                    selectedModel === model ? "bg-white/10" : ""
                  }`}
                >
                  {model}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition" title="Voice input">
          <Mic className="w-5 h-5" />
        </button>

        <button className="bg-white text-black px-5 py-2.5 rounded-lg hover:bg-gray-200 transition shadow-lg hover:scale-105 flex items-center gap-2">
          <span className="text-sm font-medium">Send</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
