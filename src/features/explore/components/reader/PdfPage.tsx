import React, { useEffect, useRef, useState } from 'react';
import { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';

interface PdfPageProps {
  pageNumber: number;
  pdfDoc: PDFDocumentProxy;
  width: number;
}

export const PdfPage: React.FC<PdfPageProps> = ({ pageNumber, pdfDoc, width }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    let renderTask: RenderTask | null = null;
    let isActive = true;

    const renderPage = async () => {
      setIsRendered(false);
      
      if (!canvasRef.current || !pdfDoc) return;

      try {
        const page = await pdfDoc.getPage(pageNumber);

        if (!isActive) return;

        const viewport = page.getViewport({ scale: 1.0 });
        const scale = width / viewport.width;
        const scaledViewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (context) {
          canvas.height = scaledViewport.height;
          canvas.width = scaledViewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: scaledViewport,
            canvas: canvas,
          };

          renderTask = page.render(renderContext);

          await renderTask.promise;

          if (isActive) {
            setIsRendered(true);
          }
        }
      } catch (error: any) {
        if (error.name !== 'RenderingCancelledException') {
          console.error(error);
        }
      }
    };

    renderPage();

    return () => {
      isActive = false;
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdfDoc, pageNumber, width]);

  return (
    <div className={`w-full bg-white mb-2 transition-opacity duration-500 ${isRendered ? 'opacity-100' : 'opacity-0 min-h-[500px]'}`}>
      <canvas ref={canvasRef} className="block w-full h-auto shadow-sm" />
    </div>
  );
};