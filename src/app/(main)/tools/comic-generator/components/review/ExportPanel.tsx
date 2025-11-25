import React, { useState } from 'react';
import { FileArchive, FileText, BookOpen, Download, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { ExportFormat } from '@/services/comic/comicExportService';
import { ExportStatus } from '@/hooks/comic/useComicExport';

interface ExportPanelProps {
  onExport: (format: ExportFormat) => void;
  isExporting: boolean;
  exportStatus: ExportStatus;
  exportProgress: number;
  exportError: string | null;
  exportedUrl: string | null;
  projectName: string;
}

const FORMAT_OPTIONS = [
  {
    id: 'cbz',
    name: 'CBZ Archive',
    description: 'Best for digital comic readers',
    icon: FileArchive,
    recommended: true
  },
  {
    id: 'pdf',
    name: 'PDF Document',
    description: 'Universal format for printing',
    icon: FileText,
    recommended: true
  },
  {
    id: 'cbr',
    name: 'CBR Archive',
    description: 'Alternative archive format',
    icon: FileArchive,
    recommended: false
  },
  {
    id: 'epub',
    name: 'EPUB E-Book',
    description: 'Standard e-book format',
    icon: BookOpen,
    recommended: false
  }
];

export const ExportPanel: React.FC<ExportPanelProps> = ({
  onExport,
  isExporting,
  exportStatus,
  exportProgress,
  exportError,
  exportedUrl,
  projectName
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('cbz');

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-bold text-gray-900">Export Project</h2>
        <p className="text-sm text-gray-500">Choose format and download</p>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-2xl">
                  {projectName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{projectName}</h3>
                  <p className="text-gray-500">Ready for publishing</p>
                </div>
              </div>

              {exportError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-900">Export Failed</p>
                    <p className="text-sm text-red-700 mt-1">{exportError}</p>
                  </div>
                </div>
              )}

              {exportStatus === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Export Complete!</h3>
                  <p className="text-gray-600 mb-6">Your file has been downloaded successfully.</p>
                  {exportedUrl && (
                    <a 
                      href={exportedUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Click here if download didn't start
                    </a>
                  )}
                  <div className="mt-8">
                    <button
                      onClick={() => window.location.reload()} 
                      className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                    >
                      Start New Export
                    </button>
                  </div>
                </div>
              ) : isExporting ? (
                <div className="py-12 text-center">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Exporting...</h3>
                  <div className="max-w-md mx-auto mt-4">
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${exportProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{exportProgress}% Complete</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {FORMAT_OPTIONS.map((format) => (
                    <button
                      key={format.id}
                      onClick={() => setSelectedFormat(format.id as ExportFormat)}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                        selectedFormat === format.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {format.recommended && (
                        <span className="absolute top-3 right-3 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                          REC
                        </span>
                      )}
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${selectedFormat === format.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                          <format.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className={`font-bold ${selectedFormat === format.id ? 'text-blue-900' : 'text-gray-900'}`}>
                            {format.name}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">{format.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {!isExporting && exportStatus !== 'success' && (
              <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => onExport(selectedFormat)}
                  className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-600/20"
                >
                  <Download className="w-5 h-5" />
                  Download {selectedFormat.toUpperCase()}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};