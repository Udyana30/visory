"use client";
import InspirationCard from "./InspirationCard";

export default function InfiniteCarousel({ items, direction = "right" }) {
  return (
    <div className="relative overflow-hidden">
      <div
        className={`flex gap-6 ${
          direction === "right" ? "animate-scroll-right" : "animate-scroll-left"
        }`}
        style={{ width: "fit-content" }}
      >
        {items.map((item, index) => (
          <div key={`${item.id}-${index}`} className="flex-shrink-0 w-80 md:w-96 lg:w-[480px]">
            <InspirationCard item={item} />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-scroll-right {
          animation: scroll-right 30s linear infinite;
        }

        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }

        .animate-scroll-right:hover,
        .animate-scroll-left:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
