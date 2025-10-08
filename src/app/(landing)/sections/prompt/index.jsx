"use client";
import SilkBackground from "./background/SilkBackground";
import PromptInput from "./ui/PromptInput";
import QuickPrompts from "./ui/QuickPrompts";
import { useState } from "react";

export default function PromptSection() {
  const [prompt, setPrompt] = useState("");

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <SilkBackground color="#ffffff" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="max-w-4xl w-full mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What do you want to create?
          </h1>
          <p className="text-base md:text-lg text-white mb-12 max-w-2xl mx-auto">
            <span className="md:text-xl">Turn your ideas into stunning visual creations</span><br />
            Create ads, contents, and stories with a simple prompt
          </p>

          <PromptInput />
          <QuickPrompts onSelect={setPrompt} />
        </div>
      </div>
    </section>
  );
}
