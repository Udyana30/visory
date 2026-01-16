'use client';

import Link from 'next/link';
import Image from 'next/image';

const tools = [
  {
    id: 'avatar',
    title: 'Avatar Generator',
    href: '/tools/avatar-generator',
    image: 'https://images.unsplash.com/photo-1727968952994-6777b484a0e8?w=800&q=80',
  },
  {
    id: 'comic',
    title: 'Comic Generator',
    href: '/tools/comic-generator',
    image: 'https://images.unsplash.com/photo-1593345216166-6a6cbf185ba0?w=800&q=80',
  },
  {
    id: 'voiceover',
    title: 'Voice Over',
    href: '/tools/text-to-speech',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80',
  },
  {
    id: 'subtitle',
    title: 'Subtitle',
    href: '/tools/speech-to-text',
    image: '/images/tools/voice.png',
  },
];

export default function ToolsGrid() {
  return (
    <section className="mt-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.href}
            className="group flex flex-col"
          >
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-xl transition-all duration-500">
              <Image
                src={tool.image}
                alt={tool.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-gray-900 text-center group-hover:text-blue-600 transition-colors duration-300">
              {tool.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}