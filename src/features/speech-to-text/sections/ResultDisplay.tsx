import React from 'react';
import { Bot, AlertCircle, FileText, Music } from 'lucide-react';
import { STTResult } from '@/types/stt';
import { formatDateTime } from '../utils/utils';

interface ResultDisplayProps {
    isLoading: boolean;
    error: string | null;
    result: STTResult | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, error, result }) => {
    const handleDownloadSRT = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!result?.output_srt_url) return;

        e.preventDefault();

        try {
            const response = await fetch(result.output_srt_url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${result.title}.srt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex flex-col">
            <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-gray-200 flex-shrink-0">
                <div className="p-2 bg-gray-100 rounded-lg">
                    <Bot size={20} className="text-gray-900" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Result</h2>
            </div>

            <div className="flex-1 flex items-center justify-center overflow-hidden">
                {isLoading && (
                    <div className="text-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-black" />
                            <p className="text-gray-900 font-semibold">Transcribing audio...</p>
                            <p className="text-sm text-gray-500">Please wait a moment</p>
                        </div>
                    </div>
                )}

                {error && !isLoading && (
                    <div className="px-6 w-full">
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-lg w-full">
                            <div className="flex items-start gap-3">
                                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold mb-1">Error</p>
                                    <p className="text-sm">{error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {result && !isLoading && !error && (
                    <div className="w-full p-6 space-y-4">
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 break-words flex items-center gap-2">
                                <Music size={18} className="text-gray-900 flex-shrink-0" />
                                {result.title}
                            </h3>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Original Audio</p>
                            <audio controls className="w-full" src={result.input_audio_url} style={{ outline: 'none' }}>
                                Your browser does not support the audio element.
                            </audio>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-sm font-semibold text-gray-900 mb-3">Transcription Result</p>
                            <div className="bg-white p-4 rounded border border-gray-300 max-h-[120px] overflow-y-auto custom-scrollbar">
                                <p className="text-gray-900 leading-relaxed whitespace-pre-wrap text-sm">
                                    {result.output_raw_text}
                                </p>
                            </div>
                        </div>

                        <div className="text-sm text-gray-600 space-y-2 pt-2 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-700">Language:</span>
                                <span className="text-gray-900 uppercase font-medium">{result.language}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-700">Created:</span>
                                <span className="text-gray-900">{formatDateTime(result.created_at)}</span>
                            </div>
                        </div>

                        <div>
                            <a
                                href={result.output_srt_url}
                                onClick={handleDownloadSRT}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg w-full"
                            >
                                <FileText size={18} />
                                Download SRT
                            </a>
                        </div>
                    </div>
                )}

                {!isLoading && !error && !result && (
                    <div className="text-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="p-4 bg-gray-100 rounded-full">
                                <FileText size={32} className="text-gray-400" />
                            </div>
                            <p className="text-gray-600 font-semibold">No transcription yet</p>
                            <p className="text-sm text-gray-500">Upload audio and click generate</p>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
        </div>
    );
};

export default ResultDisplay;
