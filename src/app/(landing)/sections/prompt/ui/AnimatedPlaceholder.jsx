"use client";
export default function AnimatedPlaceholder({ examples, index }) {
  return (
    <div className="absolute top-0 left-0 pointer-events-none overflow-hidden w-full h-[80px]">
      {examples.map((example, i) => (
        <div
          key={i}
          className={`absolute w-full transition-all duration-700 ease-in-out ${
            i === index
              ? "translate-y-0 opacity-100"
              : i === (index - 1 + examples.length) % examples.length
              ? "-translate-y-full opacity-0"
              : "translate-y-full opacity-0"
          }`}
        >
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            {example}
          </p>
        </div>
      ))}
    </div>
  );
}
