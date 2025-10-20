'use client';

import { useState } from 'react';
import { ttsService } from '@/services/ttsService';
import TtsForm from './sections/TtsForm';
import ResultDisplay from './sections/ResultDisplay';

export default function TextToSpeechPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async (payload) => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await ttsService.createTTS(payload);
      setResult(response.data);
    } catch (err) {
      setError(err.message || 'Failed to generate audio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <header className="mb-2 ml-8">
        <h1 className="text-3xl font-bold text-gray-900">Text to Speech</h1>
        <p className="mt-2 text-md text-gray-600">
          Create realistic and natural-sounding voiceovers from your text using AI.
        </p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start ml-6 mt-4">
        <div className="lg:col-span-2">
          <TtsForm isLoading={isLoading} onSubmit={handleGenerate} />
        </div>
        <div className="lg:col-span-1">
          <ResultDisplay isLoading={isLoading} error={error} result={result} />
        </div>
      </main>
    </div>
  );
}
