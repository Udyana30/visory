'use client';

import { Bot, Download, AlertCircle, CheckCircle, Music } from 'lucide-react';

export default function ResultDisplay({ isLoading, error, result }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-28">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Bot size={20} className="text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Result</h2>
      </div>
      
      {isLoading && (
        <div className="text-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
            <p className="text-gray-600 font-medium">Generating audio...</p>
            <p className="text-sm text-gray-400">Please wait a moment</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-4 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5"/>
            <div>
              <p className="font-semibold mb-1">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {result && !isLoading && (
        <div className="space-y-5">
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
            <CheckCircle size={18} />
            <span className="text-sm font-semibold">Generation Successful</span>
          </div>
          
          <div>
            <h3 className="font-bold text-lg text-gray-900 break-words mb-3 flex items-center gap-2">
              <Music size={18} className="text-blue-600 flex-shrink-0" />
              {result.title}
            </h3>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <audio 
              controls 
              className="w-full" 
              src={result.public_url || '#'}
              style={{ outline: 'none' }}
            >
              Your browser does not support the audio element.
            </audio>
          </div>
          
          <div className="text-sm text-gray-600 space-y-2 pt-3 border-t border-gray-200">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Voice:</span>
              <span className="text-gray-900">{result.voice_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Created:</span>
              <span className="text-gray-900">{new Date(result.created_at).toLocaleString()}</span>
            </div>
          </div>
          
          <a 
            href={result.public_url || '#'}
            download
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
          >
            <Download size={18} />
            Download Audio
          </a>
        </div>
      )}

      {!isLoading && !error && !result && (
        <div className="text-center py-12">
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
  );
}