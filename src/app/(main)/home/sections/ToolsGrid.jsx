'use client';

import Link from 'next/link';
import Image from 'next/image';

const tools = [
  {
    id: 1,
    title: 'Generate Video',
    href: '/tools/video',
    image: '/images/tools/video.png',
  },
  {
    id: 2,
    title: 'Generate Avatar',
    href: '/tools/avatar',
    image: '/images/tools/avatar.png',
  },
  {
    id: 3,
    title: 'Generate Image',
    href: '/tools/image',
    image: '/images/tools/image.png',
  },
  {
    id: 4,
    title: 'Create Voiceover',
    href: '/tools/speech-to-text',
    image: '/images/tools/voice.png',
  },
];

export default function ToolsGrid() {
  return (
    <section className="mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.href}
            className="group flex flex-col items-center"
          >
            <div className="relative w-full aspect-square rounded-xl overflow-hidden">
              <Image
                src={tool.image}
                alt={tool.title}
                layout="fill"
                objectFit="cover"
                className="group-hover:scale-110 transition-transform duration-800"
              />
            </div>
            <h3 className="mt-4 text-lg font-bold text-gray-800 text-center">
              {tool.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}