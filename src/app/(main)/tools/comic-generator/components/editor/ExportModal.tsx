import React, { useState } from 'react';
import { X, FileText, FileArchive, BookOpen, Download, AlertCircle } from 'lucide-react';
import { ExportFormat } from '@/services/comicExportService';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: ExportFormat) => void;
  isExporting: boolean;
  exportProgress: number;
  exportError: string | null;
}

interface FormatOption {
  id: ExportFormat;
  name: string;
  description: string;
  icon: React.ReactNode;
  extension: string;
  recommended?: boolean;
}

const formatOptions: FormatOption[] = [
  {
    id: 'pdf',
    name: 'PDF',
    description: 'Universal format, easy to share and print',
    icon: <FileText className="w-6 h-6" />,
    extension: '.pdf',
    recommended: true,
  },
  {
    id: 'cbz',
    name: 'CBZ',
    description: 'Comic book archive, supported by most comic readers',
    icon: <FileArchive className="w-6 h-6" />,
    extension: '.cbz',
    recommended: true,
  },
  {
    id: 'cbr',
    name: 'CBR',
    description: 'Alternative comic book archive format',
    icon: <FileArchive className="w-6 h-6" />,
    extension: '.cbr',
  },
  {
    id: 'epub',
    name: 'EPUB',
    description: 'E-book format for digital readers and apps',
    icon: <BookOpen className="w-6 h-6" />,
    extension: '.epub',
  },
];

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  isExporting,
  exportProgress,
  exportError,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('cbz');

  if (!isOpen) return null;

  const handleExport = () => {
    onExport(selectedFormat);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">Export Comic</h2>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {exportError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Export Failed</p>
                <p className="text-sm text-red-700 mt-1">{exportError}</p>
              </div>
            </div>
          )}

          {isExporting ? (
            <div className="py-8">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 relative mb-4">
                  <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                  <div
                    className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"
                    style={{
                      clipPath: `polygon(0 0, 100% 0, 100% ${exportProgress}%, 0 ${exportProgress}%)`,
                    }}
                  ></div>
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-2">Exporting Comic...</p>
                <p className="text-sm text-gray-600 mb-4">
                  {exportProgress < 70
                    ? 'Rendering pages...'
                    : exportProgress < 90
                    ? 'Uploading to server...'
                    : 'Finalizing...'}
                </p>
                <div className="w-full max-w-xs">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${exportProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-2">{exportProgress}%</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Select Export Format</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {formatOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedFormat(option.id)}
                      className={`relative p-4 rounded-lg border-2 transition text-left ${
                        selectedFormat === option.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      {option.recommended && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded">
                          Recommended
                        </span>
                      )}
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            selectedFormat === option.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {option.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{option.name}</h4>
                            <span className="text-xs text-gray-500">{option.extension}</span>
                          </div>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Export Information</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• All pages will be rendered at high quality (800x1280px)</li>
                  <li>• Speech bubbles and text will be embedded in the images</li>
                  <li>• The file will be downloaded directly to your device</li>
                  <li>• A backup copy will be stored on the server</li>
                </ul>
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
                >
                  <Download className="w-5 h-5" />
                  Export as {selectedFormat.toUpperCase()}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};