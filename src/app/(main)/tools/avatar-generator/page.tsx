import { Metadata } from 'next';
import { AvatarGenerator } from '@/features/avatar-generator/AvatarGenerator';

export const metadata: Metadata = {
  title: 'visory | Avatar Generator',
  description: 'Generate realistic talking avatars from images and audio.',
};

export default function AvatarGeneratorPage() {
  return <AvatarGenerator />;
}