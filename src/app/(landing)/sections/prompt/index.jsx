"use client";

import { useState } from "react";
import SilkBackground from "./ui/SilkBackground";
import PromptInput from "./ui/PromptInput";
import QuickPrompts from "./ui/QuickPrompts";

export default function PromptSection() {
  const [prompt, setPrompt] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);

  const handleQuickPrompt = (text) => setPrompt(text);

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    setShowTools(false);
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      <SilkBackground />

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-[0_6px_20px_rgba(0,0,0,0.95)] [text-shadow:_0_5px_15px_rgb(25_25_25_/_70%)]">
            What do you want to create?
          </h1>
          <p className="text-base md:text-lg text-white mb-12 max-w-2xl mx-auto leading-normal drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)] [text-shadow:_0_2px_2px_rgb(25_25_25_/_60%)]">
            <span className="md:text-xl">
              Turn your ideas into stunning visual creations
            </span>
            <br />
            Create ads, content, or stories with a simple prompt.
          </p>

          <PromptInput 
            prompt={prompt}
            setPrompt={setPrompt}
            isFocused={isFocused}
            setIsFocused={setIsFocused}
            showTools={showTools}
            setShowTools={setShowTools}
            selectedTool={selectedTool}
            onToolSelect={handleToolSelect}
          />

          <QuickPrompts onPromptSelect={handleQuickPrompt} />
        </div>
      </div>
    </section>
  );
}