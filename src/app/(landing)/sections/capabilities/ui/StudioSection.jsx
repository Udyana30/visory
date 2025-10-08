"use client";
import { useState, useRef, useEffect } from "react";
import { useInView } from "framer-motion";
import MotionWrapper from "./MotionWrapper";
import Image from "next/image";

export default function StudioSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false });
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setShowVideo(true), 500);
      return () => clearTimeout(timer);
    } else setShowVideo(false);
  }, [isInView]);

  return (
    <MotionWrapper>
      <div className="mt-20 mb-10" ref={sectionRef}>
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-2 tracking-wide">
            visory <span className="font-light">studios</span>
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold leading-tight">
            Full Creative Control <br /> Over Every Frame.
          </h3>
        </div>

        <div className="relative max-w-5xl mx-auto mb-8">
          {/* Image placeholder */}
          <div
            className={`relative w-full aspect-video rounded-xl overflow-hidden transition-opacity duration-2000 ${
              showVideo ? "opacity-0" : "opacity-100"
            }`}
          >
            <Image
              src="/images/landing/studio.png"
              alt="Visory Studio"
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
            />
          </div>

          {/* YouTube video */}
          <div
            className={`absolute inset-0 w-full h-full rounded-xl overflow-hidden transition-opacity duration-2000 ${
              showVideo ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/oYmU8Av_e84?autoplay=1&mute=1&controls=0&disablekb=1&loop=1&playlist=oYmU8Av_e84&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&fs=0"
              title="Visory Studio Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              style={{ pointerEvents: "none" }}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-20 max-w-5xl mx-auto">
          <p className="text-gray-300 text-lg md:text-xl max-w-xl leading-relaxed">
            Fine-tune every scene. Easily replace assets,
            <br />
            adjust timing, and regenerate elements <br /> to perfect your final video.
          </p>
          <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 shadow-lg whitespace-nowrap">
            Go to Studios
          </button>
        </div>
      </div>
    </MotionWrapper>
  );
}
