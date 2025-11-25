"use client";
import React, { useState, useEffect } from 'react';
import TopBar from '@/components/layout/TopBar';
import SttForm from './sections/SttForm';
import ResultDisplay from './sections/ResultDisplay';
import HistorySection from './sections/HistorySection';
import SuccessModal from './components/SuccessModal';
import { sttService } from '@/services/sttService';
import { STTResult, STTHistoryItem } from '@/types/stt';

export default function SpeechToTextPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<STTResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<STTHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await sttService.getSTT({
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

  const handleGenerate = async (payload: FormData) => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await sttService.createSTT(payload);

      setTimeout(() => {
        setResult(response.data);
        setShowSuccessModal(true);
      }, 100);

      await fetchHistory();
    } catch (err: any) {
      setError(err.message || 'Failed to transcribe audio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayFromHistory = (item: STTHistoryItem) => {
    setResult(item);
    setError(null);
  };

  const handleDeleteFromHistory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this transcription?')) return;

    try {
      await sttService.deleteSTT(id);
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
        pageTitle="Speech to Text"
        pageSubtitle={
          <>
            Convert your audio files into accurate text transcriptions using AI. <br />
            Transform spoken content into written text instantly.
          </>
        }
        showSearch={false}
        showUpgrade={true}
        showNotifications={true}
      />

      <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="lg:sticky lg:top-8">
            <SttForm isLoading={isLoading} onSubmit={handleGenerate} />
          </div>

          <div className="lg:sticky lg:top-8">
            <ResultDisplay isLoading={isLoading} error={error} result={result} />
          </div>
        </div>

        <div>
          <HistorySection
            history={history}
            isLoading={isLoadingHistory}
            onPlay={handlePlayFromHistory}
            onDelete={handleDeleteFromHistory}
            currentPlayingId={result?.id}
          />
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