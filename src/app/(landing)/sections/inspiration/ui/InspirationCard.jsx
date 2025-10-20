"use client";
import { useState, useRef, useEffect } from "react";

export default function InspirationCard({ item }) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isHovered && item.hasVideo) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered, item.hasVideo]);

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video bg-gradient-to-br from-blue-400 to-purple-600 overflow-hidden shadow-lg">
        <img
          src={item.image}
          alt={item.title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isHovered && item.hasVideo ? "opacity-0" : "opacity-100"
          }`}
        />

        {item.hasVideo && (
          <video
            ref={videoRef}
            src={item.video}
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="font-semibold text-white text-lg mb-1">
              {item.title}
            </h3>
            <p className="text-sm text-gray-200">{item.category}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
