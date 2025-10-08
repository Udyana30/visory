'use client';

import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden rounded-2xl bg-white h-60 md:h-80 shadow-lg">
      <div className="absolute inset-0">
        <Image
          src="/images/banner.png"
          alt="Visory hero background"
          layout="fill"
          objectFit="cover"
          objectPosition="right"
          priority
        />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-center p-8 md:p-12">
        <h1 className="text-3xl font-bold text-gray-900 md:text-5xl">
          Good Morning, User
        </h1>
        <p className="mt-2 text-md text-gray-700 md:text-xl">
          What would you like to create today?
        </p>
      </div>
    </section>
  );
}