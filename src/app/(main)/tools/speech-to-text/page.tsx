import { Metadata } from 'next';
import { SpeechToText } from '@/features/speech-to-text/SpeechToText';

export const metadata: Metadata = {
  title: 'visory | Speech to Text',
  description: 'Convert your audio files into accurate text transcriptions using AI.',
};

export default function SpeechToTextPage() {
  return <SpeechToText />;
}