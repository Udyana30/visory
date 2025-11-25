import { ComicPage } from '../types/editor';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';

export interface RenderOptions {
  width: number;
  height: number;
  quality: number;
  backgroundColor: string;
}

const DEFAULT_OPTIONS: RenderOptions = {
  width: 800,
  height: 1280,
  quality: 0.95,
  backgroundColor: '#ffffff',
};

const normalizeColor = (color: string): string => {
  if (!color) return '#000000';
  
  const colorStr = String(color).toLowerCase().trim();
  
  if (colorStr.startsWith('lab(') || 
      colorStr.startsWith('lch(') || 
      colorStr.startsWith('oklab(') || 
      colorStr.startsWith('oklch(') ||
      colorStr.includes('lab') ||
      colorStr.includes('lch')) {
    return '#000000';
  }
  
  if (colorStr.startsWith('#')) {
    return color;
  }
  
  if (colorStr.startsWith('rgb')) {
    return color;
  }
  
  if (colorStr.startsWith('hsl')) {
    return color;
  }
  
  const namedColors: Record<string, string> = {
    white: '#ffffff',
    black: '#000000',
    red: '#ff0000',
    green: '#008000',
    blue: '#0000ff',
    yellow: '#ffff00',
    cyan: '#00ffff',
    magenta: '#ff00ff',
    gray: '#808080',
    grey: '#808080',
    transparent: 'rgba(0,0,0,0)',
  };
  
  return namedColors[colorStr] || '#000000';
};

const sanitizeStyles = (element: HTMLElement) => {
  const computedStyle = window.getComputedStyle(element);
  
  if (computedStyle.backgroundColor && computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)') {
    element.style.backgroundColor = normalizeColor(computedStyle.backgroundColor);
  }
  
  if (computedStyle.color) {
    element.style.color = normalizeColor(computedStyle.color);
  }
  
  if (computedStyle.borderColor) {
    element.style.borderColor = normalizeColor(computedStyle.borderColor);
  }
  
  if (computedStyle.borderTopColor) {
    element.style.borderTopColor = normalizeColor(computedStyle.borderTopColor);
  }
  
  if (computedStyle.borderRightColor) {
    element.style.borderRightColor = normalizeColor(computedStyle.borderRightColor);
  }
  
  if (computedStyle.borderBottomColor) {
    element.style.borderBottomColor = normalizeColor(computedStyle.borderBottomColor);
  }
  
  if (computedStyle.borderLeftColor) {
    element.style.borderLeftColor = normalizeColor(computedStyle.borderLeftColor);
  }
};

export const renderPageToCanvas = async (
  page: ComicPage,
  options: Partial<RenderOptions> = {}
): Promise<HTMLCanvasElement> => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  const container = document.createElement('div');
  container.style.cssText = `
    position: absolute;
    left: -9999px;
    top: -9999px;
    width: ${opts.width}px;
    height: ${opts.height}px;
    background-color: ${normalizeColor(page.backgroundColor || opts.backgroundColor)};
    font-family: Arial, sans-serif;
    box-sizing: border-box;
  `;
  
  document.body.appendChild(container);

  try {
    for (const panel of page.panels) {
      const panelDiv = document.createElement('div');
      panelDiv.style.cssText = `
        position: absolute;
        left: ${(panel.x / 100) * opts.width}px;
        top: ${(panel.y / 100) * opts.height}px;
        width: ${(panel.width / 100) * opts.width}px;
        height: ${(panel.height / 100) * opts.height}px;
        transform: rotate(${panel.rotation}deg);
        overflow: hidden;
        border: 2px solid #000000;
        box-sizing: border-box;
      `;

      if (panel.imageUrl) {
        const img = document.createElement('img');
        img.crossOrigin = 'anonymous';
        img.src = panel.imageUrl;
        img.style.cssText = `
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        `;
        
        if (panel.imagePosition) {
          img.style.objectPosition = `${panel.imagePosition.x}% ${panel.imagePosition.y}%`;
        }
        
        if (panel.imageScale) {
          img.style.transform = `scale(${panel.imageScale})`;
        }
        
        panelDiv.appendChild(img);
      }

      container.appendChild(panelDiv);
    }

    if (page.bubbles) {
      for (const bubble of page.bubbles) {
        const bubbleDiv = document.createElement('div');
        bubbleDiv.style.cssText = `
          position: absolute;
          left: ${(bubble.x / 100) * opts.width}px;
          top: ${(bubble.y / 100) * opts.height}px;
          width: ${(bubble.width / 100) * opts.width}px;
          height: ${(bubble.height / 100) * opts.height}px;
          background-color: ${normalizeColor(bubble.backgroundColor)};
          border: ${bubble.borderWidth}px solid ${normalizeColor(bubble.borderColor)};
          border-radius: ${getBubbleBorderRadius(bubble.type)};
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          z-index: 10;
        `;

        const textSpan = document.createElement('span');
        textSpan.textContent = bubble.text;
        textSpan.style.cssText = `
          font-size: ${bubble.fontSize}px;
          font-family: ${bubble.fontFamily}, Arial, sans-serif;
          color: ${normalizeColor(bubble.color)};
          text-align: ${bubble.textAlign};
          width: 100%;
          word-wrap: break-word;
          line-height: 1.2;
        `;

        bubbleDiv.appendChild(textSpan);
        container.appendChild(bubbleDiv);
      }
    }

    await waitForImages(container);

    const allElements = container.querySelectorAll('*');
    allElements.forEach((el) => {
      sanitizeStyles(el as HTMLElement);
    });
    sanitizeStyles(container);

    const canvas = await html2canvas(container, {
      width: opts.width,
      height: opts.height,
      scale: 2,
      backgroundColor: normalizeColor(page.backgroundColor || opts.backgroundColor),
      logging: false,
      allowTaint: false,
      useCORS: true,
      foreignObjectRendering: false,
      imageTimeout: 0,
    });

    return canvas;
  } finally {
    document.body.removeChild(container);
  }
};

const getBubbleBorderRadius = (type: string): string => {
  switch (type) {
    case 'speech':
      return '12px';
    case 'thought':
      return '50%';
    case 'shout':
      return '4px';
    case 'whisper':
      return '8px';
    case 'narration':
      return '0px';
    default:
      return '12px';
  }
};

const waitForImages = (container: HTMLElement): Promise<void> => {
  const images = Array.from(container.querySelectorAll('img'));
  
  return Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = () => resolve();
            img.onerror = () => resolve();
            setTimeout(() => resolve(), 5000);
          }
        })
    )
  ).then(() => {});
};

export const renderPagesToPDF = async (
  pages: ComicPage[],
  options: Partial<RenderOptions> = {}
): Promise<Blob> => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const pdf = new jsPDF({
    orientation: opts.height > opts.width ? 'portrait' : 'landscape',
    unit: 'px',
    format: [opts.width, opts.height],
  });

  for (let i = 0; i < pages.length; i++) {
    const canvas = await renderPageToCanvas(pages[i], opts);
    const imgData = canvas.toDataURL('image/jpeg', opts.quality);

    if (i > 0) {
      pdf.addPage([opts.width, opts.height]);
    }

    pdf.addImage(imgData, 'JPEG', 0, 0, opts.width, opts.height);
  }

  return pdf.output('blob');
};

export const renderPagesToCBZ = async (
  pages: ComicPage[],
  options: Partial<RenderOptions> = {}
): Promise<Blob> => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const zip = new JSZip();

  for (let i = 0; i < pages.length; i++) {
    const canvas = await renderPageToCanvas(pages[i], opts);
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), 'image/jpeg', opts.quality);
    });

    const fileName = `page_${String(i + 1).padStart(3, '0')}.jpg`;
    zip.file(fileName, blob);
  }

  const comicInfoXml = generateComicInfoXml(pages.length);
  zip.file('ComicInfo.xml', comicInfoXml);

  return await zip.generateAsync({ type: 'blob' });
};

export const renderPagesToCBR = async (
  pages: ComicPage[],
  options: Partial<RenderOptions> = {}
): Promise<Blob> => {
  return renderPagesToCBZ(pages, options);
};

export const renderPagesToEPUB = async (
  pages: ComicPage[],
  projectName: string,
  options: Partial<RenderOptions> = {}
): Promise<Blob> => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const zip = new JSZip();

  zip.file('mimetype', 'application/epub+zip');

  const metaInf = zip.folder('META-INF');
  metaInf!.file('container.xml', generateContainerXml());

  const oebps = zip.folder('OEBPS');
  const images = oebps!.folder('Images');

  const imageRefs: string[] = [];

  for (let i = 0; i < pages.length; i++) {
    const canvas = await renderPageToCanvas(pages[i], opts);
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), 'image/jpeg', opts.quality);
    });

    const fileName = `page_${String(i + 1).padStart(3, '0')}.jpg`;
    images!.file(fileName, blob);
    imageRefs.push(fileName);
  }

  oebps!.file('content.opf', generateContentOpf(projectName, imageRefs));
  oebps!.file('toc.ncx', generateTocNcx(projectName, imageRefs));

  for (let i = 0; i < imageRefs.length; i++) {
    oebps!.file(`page_${i + 1}.xhtml`, generatePageXhtml(imageRefs[i], i + 1));
  }

  return await zip.generateAsync({ type: 'blob' });
};

const generateComicInfoXml = (pageCount: number): string => {
  return `<?xml version="1.0"?>
<ComicInfo xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <PageCount>${pageCount}</PageCount>
  <Format>Digital</Format>
</ComicInfo>`;
};

const generateContainerXml = (): string => {
  return `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
};

const generateContentOpf = (title: string, images: string[]): string => {
  const manifest = images
    .map((img, i) => `    <item id="page_${i + 1}" href="page_${i + 1}.xhtml" media-type="application/xhtml+xml"/>
    <item id="img_${i + 1}" href="Images/${img}" media-type="image/jpeg"/>`)
    .join('\n');

  const spine = images
    .map((_, i) => `    <itemref idref="page_${i + 1}"/>`)
    .join('\n');

  return `<?xml version="1.0"?>
<package version="2.0" xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${title}</dc:title>
    <dc:language>en</dc:language>
    <dc:identifier id="BookId">urn:uuid:${generateUUID()}</dc:identifier>
    <meta name="cover" content="img_1"/>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
${manifest}
  </manifest>
  <spine toc="ncx">
${spine}
  </spine>
</package>`;
};

const generateTocNcx = (title: string, images: string[]): string => {
  const navPoints = images
    .map(
      (_, i) => `    <navPoint id="navPoint-${i + 1}" playOrder="${i + 1}">
      <navLabel>
        <text>Page ${i + 1}</text>
      </navLabel>
      <content src="page_${i + 1}.xhtml"/>
    </navPoint>`
    )
    .join('\n');

  return `<?xml version="1.0"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:${generateUUID()}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle>
    <text>${title}</text>
  </docTitle>
  <navMap>
${navPoints}
  </navMap>
</ncx>`;
};

const generatePageXhtml = (imagePath: string, pageNum: number): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Page ${pageNum}</title>
  <style type="text/css">
    body { margin: 0; padding: 0; text-align: center; }
    img { max-width: 100%; max-height: 100vh; }
  </style>
</head>
<body>
  <img src="Images/${imagePath}" alt="Page ${pageNum}"/>
</body>
</html>`;
};

const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};