"use client";
export default function QuickPrompts({ onSelect }) {
  const prompts = [
    "Generate a dramatic video shot of Los Angeles",
    "Make an ad photo for my black tea",
    "Design a minimalist living room",
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {prompts.map((p) => (
        <button
          key={p}
          onClick={() => onSelect(p)}
          className="group relative backdrop-blur-sm bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full text-sm transition-all duration-300 ring-1 ring-white/20 hover:ring-white/40"
        >
          {p}
        </button>
      ))}
    </div>
  );
}
