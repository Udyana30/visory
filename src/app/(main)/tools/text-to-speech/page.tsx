'use client';

import React, { useState, useEffect } from 'react';
import TopBar from '@/components/layout/TopBar';
import TtsForm from './sections/TtsForm';
import ResultDisplay from './sections/ResultDisplay';
import HistorySection from './sections/HistorySection';
import SuccessModal from './components/SuccessModal';
import { ttsService } from '@/services/ttsService';
import { TTSResult, TTSHistoryItem, TTSRequestData } from '@/types/tts';

export default function TextToSpeechPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TTSResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<TTSHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [audioKey, setAudioKey] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await ttsService.getTTS({
        order_by: 'created_at',
        order_dir: 'desc',
        limit: 50,
      });
      setHistory(response.data || []);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleGenerate = async (payload: TTSRequestData) => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    setAudioKey(prev => prev + 1);

    try {
      const response = await ttsService.createTTS(payload);
      
      setTimeout(() => {
        setResult(response.data);
        setAudioKey(prev => prev + 1);
        setShowSuccessModal(true);
      }, 100);
      
      await fetchHistory();
    } catch (err: any) {
      setError(err.message || 'Failed to generate audio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayFromHistory = (item: TTSHistoryItem) => {
    setResult(item);
    setError(null);
    setAudioKey(prev => prev + 1);
  };

  const handleDeleteFromHistory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await ttsService.deleteTTS(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
      
      if (result?.id === id) {
        setResult(null);
      }
    } catch (err) {
      console.error('Failed to delete:', err);
      setError('Failed to delete item. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        pageTitle="Text to Speech"
        pageSubtitle={
          <>
            Create realistic and natural-sounding voiceovers from your text using AI. <br />
            Transform written content into professional audio instantly.
          </>
        }
        showSearch={false}
        showUpgrade={true}
        showNotifications={true}
      />

      <div className="px-15 mx-auto pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <TtsForm isLoading={isLoading} onSubmit={handleGenerate} />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <ResultDisplay 
              key={audioKey}
              isLoading={isLoading} 
              error={error} 
              result={result}
            />
            
            <HistorySection
              history={history}
              isLoading={isLoadingHistory}
              onPlay={handlePlayFromHistory}
              onDelete={handleDeleteFromHistory}
              currentPlayingId={result?.id}
            />
          </div>
        </div>
      </div>

      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)}
        title={result?.title}
      />
    </div>
  );
}