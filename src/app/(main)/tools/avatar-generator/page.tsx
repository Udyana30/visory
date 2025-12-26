import { Metadata } from 'next';
import { VoiceLibraryProvider } from '@/features/avatar-generator/context/VoiceLibraryContext';
import { TTSProvider } from '@/features/avatar-generator/context/TTSContext';
import { AvatarGenerator } from '@/features/avatar-generator/AvatarGenerator';

export const metadata: Metadata = {
  title: 'visory | Avatar Generator',
  description: 'Generate realistic talking avatars from images and audio.',
};

export default function AvatarGeneratorPage() {
  return (
    <VoiceLibraryProvider>
      <TTSProvider>
        <AvatarGenerator />
      </TTSProvider>
    </VoiceLibraryProvider>
  );
}