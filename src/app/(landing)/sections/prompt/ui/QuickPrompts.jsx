"use client";

const QUICK_PROMPT_TEXTS = [
  "Generate a dramatic video shot of Los Angeles",
  "Make an ad photo for my black tea",
  "Design a minimalist living room",
];

export default function QuickPrompts({ onPromptSelect }) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-10 mb-20 max-w-3xl mx-auto">
      {QUICK_PROMPT_TEXTS.map((text) => (
        <button
          key={text}
          onClick={() => onPromptSelect(text)}
          className="backdrop-blur-sm bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full text-sm ring-1 ring-white/20 hover:ring-white/40 transition-all"
        >
          {text}
        </button>
      ))}
    </div>
  );
}