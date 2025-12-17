import React, { useRef, useState, useEffect } from 'react';
import { useCbzReader, usePdfReader } from '../../hooks/useComicReader';
import { PdfPage } from './PdfPage';
import { getFileType } from '@/lib/file';
import { Loader2, AlertCircle, Download } from 'lucide-react';

interface ComicReaderProps {
  url: string | null;
  title: string;
}

export const ComicReader: React.FC<ComicReaderProps> = ({ url, title }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const fileType = getFileType(url);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, []);

  if (!url) return null;

  if (fileType === 'pdf') {
    return <PdfViewer url={url} width={containerWidth} />;
  }

  if (fileType === 'cbz') {
    return <CbzViewer url={url} />;
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
      <AlertCircle className="w-10 h-10 text-gray-400 mb-2" />
      <p className="text-gray-500 mb-4">Preview not available for this format</p>
      <a 
        href={url}
        download
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Download size={16} />
        Download File
      </a>
    </div>
  );
};

const PdfViewer: React.FC<{ url: string; width: number }> = ({ url, width }) => {
  const { pdfDoc, status } = usePdfReader(url);

  if (status === 'loading') {
    return (
      <div className="w-full h-96 flex items-center justify-center text-blue-600">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (status === 'error' || !pdfDoc) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center text-red-500">
        <AlertCircle className="w-8 h-8 mb-2" />
        <p>Failed to load PDF</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto bg-gray-100 p-4 rounded-xl min-h-screen">
      {Array.from({ length: pdfDoc.numPages }, (_, index) => (
        <PdfPage 
          key={`page_${index + 1}`}
          pageNumber={index + 1}
          pdfDoc={pdfDoc}
          width={width > 0 ? width : 800}
        />
      ))}
    </div>
  );
};

const CbzViewer: React.FC<{ url: string }> = ({ url }) => {
  const { pages, status, progress } = useCbzReader(url);

  if (status === 'loading') {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-500">Extracting Comic ({progress}%)</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center text-red-500">
        <AlertCircle className="w-8 h-8 mb-2" />
        <p>Failed to extract CBZ file</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto bg-gray-900 p-2 rounded-xl min-h-screen">
      {pages.map((pageSrc, index) => (
        <img
          key={index}
          src={pageSrc}
          alt={`Page ${index + 1}`}
          className="w-full h-auto block mb-1"
          loading="lazy"
        />
      ))}
    </div>
  );
};