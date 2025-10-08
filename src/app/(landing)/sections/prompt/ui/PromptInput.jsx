"use client";
import { useState, useEffect } from "react";
import AnimatedPlaceholder from "./AnimatedPlaceholder";
import PromptToolbar from "./PromptToolbar";
import { PROMPT_EXAMPLES } from "../data";

export default function PromptInput() {
  const [prompt, setPrompt] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [currentExample, setCurrentExample] = useState(0);

  useEffect(() => {
    if (!isFocused && prompt === "") {
      const interval = setInterval(() => {
        setCurrentExample((prev) => (prev + 1) % PROMPT_EXAMPLES.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isFocused, prompt]);

  return (
    <div className="max-w-3xl mx-auto mb-8 relative">
      <div
        className={`relative backdrop-blur-xl bg-white/20 rounded-3xl border border-white/30 transition-all duration-300 ${
          isFocused
            ? "shadow-[0_0_40px_rgba(255,255,255,0.4)]"
            : "shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        }`}
      >
        <div className="p-6 min-h-[140px] relative">
          {!isFocused && prompt === "" && (
            <AnimatedPlaceholder examples={PROMPT_EXAMPLES} index={currentExample} />
          )}
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full resize-none border-none outline-none text-white bg-transparent text-base md:text-lg leading-relaxed relative z-10"
            rows="3"
          />
        </div>

        <PromptToolbar prompt={prompt} setPrompt={setPrompt} />
      </div>
    </div>
  );
}
