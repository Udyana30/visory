'use client';

import { Search, Bell, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProfileDropdown from '@/components/ui/ProfileDropdown';
import SttForm from './sections/SttForm';
import ResultDisplay from './sections/ResultDisplay';
import { useSTT } from '@/hooks/useSTT';

export default function SttPage() {
  const router = useRouter();
  const { isLoading, error, result, generateSTT } = useSTT();

  const handleSubmit = async (formData) => {
    try {
      await generateSTT(formData);
    } catch (err) {
      console.error('Error generating STT:', err);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Speech to Text</h1>
            <p className="text-gray-600">Convert your audio files into accurate text transcriptions</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <SttForm isLoading={isLoading} onSubmit={handleSubmit} />
            </div>
            <div>
              <ResultDisplay isLoading={isLoading} error={error} result={result} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}