import { useState, useEffect } from 'react';
import JSZip from 'jszip';
import * as pdfjs from 'pdfjs-dist';

if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

export type ReaderStatus = 'loading' | 'ready' | 'error';

interface UseComicReaderReturn {
  pages: string[];
  status: ReaderStatus;
  progress: number;
}

export const useCbzReader = (url: string | null): UseComicReaderReturn => {
  const [pages, setPages] = useState<string[]>([]);
  const [status, setStatus] = useState<ReaderStatus>('loading');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!url) return;

    const loadCbz = async () => {
      try {
        setStatus('loading');
        setProgress(10);

        const response = await fetch(url);
        const blob = await response.blob();
        setProgress(40);

        const zip = await JSZip.loadAsync(blob);
        setProgress(60);

        const imageFiles = Object.values(zip.files).filter(file => 
          !file.dir && /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name)
        );

        imageFiles.sort((a, b) => 
          a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
        );

        const imageUrls = await Promise.all(
          imageFiles.map(async (file) => {
            const content = await file.async('blob');
            return URL.createObjectURL(content);
          })
        );

        setPages(imageUrls);
        setStatus('ready');
        setProgress(100);
      } catch (error) {
        console.error(error);
        setStatus('error');
      }
    };

    loadCbz();

    return () => {
      pages.forEach(p => URL.revokeObjectURL(p));
    };
  }, [url]);

  return { pages, status, progress };
};

export const usePdfReader = (url: string | null) => {
  const [pdfDoc, setPdfDoc] = useState<pdfjs.PDFDocumentProxy | null>(null);
  const [status, setStatus] = useState<ReaderStatus>('loading');

  useEffect(() => {
    if (!url) return;

    const loadPdf = async () => {
      try {
        setStatus('loading');
        const loadingTask = pdfjs.getDocument(url);
        const doc = await loadingTask.promise;
        setPdfDoc(doc);
        setStatus('ready');
      } catch (error) {
        console.error(error);
        setStatus('error');
      }
    };

    loadPdf();
  }, [url]);

  return { pdfDoc, status };
};