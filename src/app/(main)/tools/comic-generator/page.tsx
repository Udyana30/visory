import React from 'react';
import { Metadata } from 'next';
import { ComicGenerator } from '@/features/comic-generator/ComicGenerator';

export const metadata: Metadata = {
  title: 'visory | Comic Generator',
  description: 'Create professional comics with AI-powered tools. Customize characters, scenes, and layouts effortlessly.',
};

export default function ComicGeneratorPage() {
  return (
    <main className="w-full min-h-screen bg-gray-50">
      <ComicGenerator />
    </main>
  );
}