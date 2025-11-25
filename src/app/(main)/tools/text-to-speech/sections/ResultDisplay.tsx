import React, { useEffect } from 'react';
import { Bot, Download, AlertCircle, Music, Play, Pause, Loader2 } from 'lucide-react';
import { TTSResult } from '@/types/tts';
import { formatDateTime } from '../lib/tts.utils';
import { formatDuration } from '../lib/audio.utils';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

interface ResultDisplayProps {
  isLoading: boolean;
  error: string | null;
  result: TTSResult | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, error, result }) => {
  const {
    isPlaying,
    isLoading: audioLoading,
    duration,
    currentTime,
    progress,
    error: audioError,
    togglePlay,
    seek,
    audioRef,
  } = useAudioPlayer({
    src: result?.output_speech_url || null,
    autoPlay: false,
  });

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration === 0) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * duration;
    seek(newTime);
  };

  const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!result?.output_speech_url) return;
    
    e.preventDefault();
    
    try {
      const response = await fetch(result.output_speech_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${result.title}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-[380px] flex flex-col">
      <div className="flex items-center gap-3 mb-2 pb-4 border-b border-gray-200">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Bot size={20} className="text-gray-900" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Result</h2>
      </div>

      <div className="flex-1 flex items-center justify-center">
        {isLoading && (
          <div className="text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-black" />
              <p className="text-gray-600 font-medium">Generating audio...</p>
              <p className="text-sm text-gray-400">Please wait a moment</p>
            </div>
          </div>
        )}

        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-lg w-full">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {result && !isLoading && !error && (
          <div className="space-y-4 w-full">
            <div>
              <h3 className="font-bold text-lg text-gray-900 break-words flex items-center gap-2">
                <Music size={18} className="text-gray-900 flex-shrink-0" />
                {result.title}
              </h3>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
              <audio ref={audioRef} className="hidden" />

              {audioError ? (
                <div className="text-center py-4 text-red-600 text-sm">
                  Failed to load audio. Please try downloading.
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <div 
                      className="relative h-2 bg-gray-200 rounded-full cursor-pointer group"
                      onClick={handleProgressClick}
                    >
                      <div 
                        className="absolute h-full bg-black rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ left: `calc(${progress}% - 8px)` }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500 font-mono">
                      <span>{formatDuration(currentTime)}</span>
                      <span>{formatDuration(duration)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={togglePlay}
                      disabled={audioLoading}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {audioLoading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Loading
                        </>
                      ) : isPlaying ? (
                        <>
                          <Pause size={18} />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play size={18} />
                          Play
                        </>
                      )}
                    </button>

                    <a
                      href={result.output_speech_url}
                      onClick={handleDownload}
                      className="flex items-center justify-center px-4 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                      title="Download Audio"
                    >
                      <Download size={18} />
                    </a>
                  </div>
                </>
              )}
            </div>

            <div className="text-sm text-gray-600 space-y-2 pt-2 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Voice:</span>
                <span className="text-gray-900">{result.voice_name}</span>
              </div>
              {duration > 0 && (
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Duration:</span>
                  <span className="text-gray-900">{formatDuration(duration)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Created:</span>
                <span className="text-gray-900">{formatDateTime(result.created_at)}</span>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && !result && (
          <div className="text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 bg-gray-100 rounded-full">
                <Music size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No audio generated yet</p>
              <p className="text-sm text-gray-400">Fill the form and click generate</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;