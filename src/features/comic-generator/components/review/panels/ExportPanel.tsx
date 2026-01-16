import React, { useState } from 'react';
import { FileArchive, FileText, Download, CheckCircle, AlertCircle, RefreshCw, Globe } from 'lucide-react';
import { ExportFormat, ProcessStatus } from '@/features/comic-generator/types/domain/review';

interface ExportPanelProps {
  projectName: string;
  status: ProcessStatus;
  progress: number;
  error: string | null;
  url: string | null;
  onExport: (format: ExportFormat, isPublic: boolean) => void;
  onReset: () => void;
}

const FORMAT_OPTIONS = [
  { id: 'pdf', name: 'PDF', desc: 'Universal format', icon: FileText },
  { id: 'cbz', name: 'CBZ', desc: 'Comic reader', icon: FileArchive },
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
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [isPublic, setIsPublic] = useState(false);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-bold text-gray-900">Export Project</h2>
        <p className="text-sm text-gray-500">Download your comic</p>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">

            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-600/20">
                {projectName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{projectName}</h3>
                <p className="text-sm text-gray-500">Ready to export</p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 text-red-900">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Export Failed</p>
                  <p className="text-xs mt-1 opacity-90">{error}</p>
                </div>
              </div>
            )}

            {status === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Export Complete!</h3>
                <p className="text-sm text-gray-600 mb-6">Your file is ready</p>

                <div className="flex flex-col gap-2 max-w-xs mx-auto">
                  {url && (
                    <a
                      href={url}
                      className="flex items-center justify-center gap-2 w-full px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      Download Again
                    </a>
                  )}
                  <button
                    onClick={onReset}
                    className="flex items-center justify-center gap-2 w-full px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                    New Export
                  </button>
                </div>
              </div>
            ) : status === 'loading' ? (
              <div className="py-12 text-center">
                <div className="relative w-14 h-14 mx-auto mb-4">
                  <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
                  <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-2">Processing...</h3>
                <p className="text-sm text-gray-500 mb-4">Building your file</p>

                <div className="max-w-xs mx-auto bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Select Format</label>
                  <div className="grid grid-cols-2 gap-3">
                    {FORMAT_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedFormat(option.id as ExportFormat)}
                        className={`relative p-4 rounded-lg border-2 text-left transition-all ${selectedFormat === option.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg transition-colors ${selectedFormat === option.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                            }`}>
                            <option.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className={`font-bold text-sm ${selectedFormat === option.id ? 'text-blue-900' : 'text-gray-900'}`}>
                              {option.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {option.desc}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Public Gallery Toggle */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-bold text-gray-900">Make Public</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Share your comic in the public gallery for others to discover and enjoy
                      </p>
                    </div>
                  </label>
                </div>

                <button
                  onClick={() => onExport(selectedFormat, isPublic)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Download {selectedFormat.toUpperCase()}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};