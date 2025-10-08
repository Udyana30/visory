"use client";
import { capabilities } from "./data";
import SectionHeader from "./ui/SectionHeader";
import CapabilityCard from "./ui/CapabilityCard";
import ZigzagFeature from "./ui/ZigzagFeature";
import StudioSection from "./ui/StudioSection";
import MotionWrapper from "./ui/MotionWrapper";

export default function CapabilitiesSection() {
  return (
    <section className="bg-[#252525] text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-20">
        <SectionHeader />

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {capabilities.slice(0, 2).map((item, i) => (
            <MotionWrapper key={i}>
              <CapabilityCard {...item} />
            </MotionWrapper>
          ))}
        </div>

        {/* Zigzag Features */}
        <MotionWrapper>
          <ZigzagFeature items={capabilities.slice(2)} />
        </MotionWrapper>

        {/* Studio Section */}
        <StudioSection />
      </div>
    </section>
  );
}
