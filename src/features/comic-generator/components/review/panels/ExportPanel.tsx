import React, { useState } from 'react';
import { FileArchive, FileText, BookOpen, Download, CheckCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { ExportFormat, ProcessStatus } from '@/features/comic-generator/types/domain/review';

interface ExportPanelProps {
  projectName: string;
  status: ProcessStatus;
  progress: number;
  error: string | null;
  url: string | null;
  onExport: (format: ExportFormat) => void;
  onReset: () => void;
}

const FORMAT_OPTIONS = [
  { id: 'cbz', name: 'CBZ Archive', desc: 'Best for digital comic readers', icon: FileArchive, recommended: true },
  { id: 'pdf', name: 'PDF Document', desc: 'Universal format for printing', icon: FileText, recommended: true },
  { id: 'epub', name: 'EPUB E-Book', desc: 'Standard e-book format', icon: BookOpen, recommended: false },
  { id: 'cbr', name: 'CBR Archive', desc: 'Alternative archive format', icon: FileArchive, recommended: false },
] as const;

export const ExportPanel: React.FC<ExportPanelProps> = ({
  projectName,
  status,
  progress,
  error,
  url,
  onExport,
  onReset
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('cbz');

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-bold text-gray-900">Export Project</h2>
        <p className="text-sm text-gray-500">Choose a format to download your comic</p>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-600/20">
                {projectName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{projectName}</h3>
                <p className="text-gray-500">Ready for publishing</p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 text-red-900 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-medium">Export Failed</p>
                  <p className="text-sm mt-1 opacity-90">{error}</p>
                </div>
              </div>
            )}

            {status === 'success' ? (
              <div className="text-center py-8 animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Export Complete!</h3>
                <p className="text-gray-600 mb-8">Your file has been processed and downloaded successfully.</p>
                
                <div className="flex flex-col gap-3 max-w-xs mx-auto">
                  {url && (
                    <a 
                      href={url} 
                      className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-bold shadow-lg"
                    >
                      <Download className="w-4 h-4" />
                      Download Again
                    </a>
                  )}
                  <button 
                    onClick={onReset} 
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Start New Export
                  </button>
                </div>
              </div>
            ) : status === 'loading' ? (
              <div className="py-16 text-center">
                <div className="relative w-16 h-16 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
                  <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Export...</h3>
                <p className="text-gray-500 mb-6">Please wait while we build your file</p>
                
                <div className="max-w-md mx-auto bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FORMAT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedFormat(option.id as ExportFormat)}
                    className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 group ${
                      selectedFormat === option.id
                        ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600/20'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    {option.recommended && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full tracking-wide uppercase">
                        Recommended
                      </span>
                    )}
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg transition-colors ${
                        selectedFormat === option.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-blue-600'
                      }`}>
                        <option.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className={`font-bold mb-1 ${selectedFormat === option.id ? 'text-blue-900' : 'text-gray-900'}`}>
                          {option.name}
                        </h4>
                        <p className="text-sm text-gray-500 leading-snug">
                          {option.desc}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {status === 'idle' || status === 'error' ? (
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => onExport(selectedFormat)}
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-600/20 active:scale-[0.98]"
              >
                <Download className="w-5 h-5" />
                Download {selectedFormat.toUpperCase()}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};