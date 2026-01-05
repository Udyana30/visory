'use client';

import React from 'react';
import TopBar from '@/components/layout/TopBar';
import SttForm from './sections/SttForm';
import ResultDisplay from './sections/ResultDisplay';
import HistorySection from './sections/HistorySection';
import SuccessModal from './components/SuccessModal';
import { useSpeechToText } from './hooks/useSpeechToText';

export const SpeechToText: React.FC = () => {
    const {
        isLoading,
        result,
        error,
        history,
        isLoadingHistory,
        showSuccessModal,
        handleGenerate,
        handlePlayFromHistory,
        handleDeleteFromHistory,
        handleCloseSuccessModal,
    } = useSpeechToText();

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
                onClose={handleCloseSuccessModal}
                title={result?.title}
            />
        </div>
    );
};
