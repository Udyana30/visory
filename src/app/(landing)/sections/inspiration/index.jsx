"use client";

import InfiniteCarousel from "./ui/InfiniteCarousel";
import { topRowItems, bottomRowItems } from "./data";

export default function InspirationSection() {
  const duplicatedTop = [...topRowItems, ...topRowItems, ...topRowItems];
  const duplicatedBottom = [...bottomRowItems, ...bottomRowItems, ...bottomRowItems];

  return (
    <section className="bg-white py-20 overflow-hidden">
      <div className="text-center mb-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
          Inspiration Showcase
        </h2>
        <p className="text-lg md:text-2xl text-gray-600 max-w-2xl mx-auto leading-normal">
          Get a glimpse of the stunning <br />
          visual stories you can create in minutes
        </p>
      </div>

      <div className="space-y-10 mb-5">
        <InfiniteCarousel items={duplicatedTop} direction="right" />
        <InfiniteCarousel items={duplicatedBottom} direction="left" />
      </div>
    </section>
  );
}
