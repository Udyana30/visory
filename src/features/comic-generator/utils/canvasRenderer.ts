import { ComicPage, ComicPanel, SpeechBubble } from '../types/domain/editor';

const loadImage = (url: string, timeout = 5000): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const timer = setTimeout(() => {
      img.src = "";
      reject(new Error('Image load timeout'));
    }, timeout);

    img.onload = () => {
      clearTimeout(timer);
      resolve(img);
    };
    
    img.onerror = () => {
      clearTimeout(timer);
      reject(new Error('Image load failed'));
    };
    
    img.src = url;
  });
};

const drawBubble = (
  ctx: CanvasRenderingContext2D, 
  bubble: SpeechBubble, 
  pageWidth: number, 
  pageHeight: number
) => {
  const { x, y, width, height, style, text } = bubble;
  
  const absX = (x / 100) * pageWidth;
  const absY = (y / 100) * pageHeight;
  const absW = (width / 100) * pageWidth;
  const absH = (height / 100) * pageHeight;

  ctx.save();
  ctx.fillStyle = style.backgroundColor;
  ctx.strokeStyle = style.borderColor;
  ctx.lineWidth = style.borderWidth;

  ctx.beginPath();
  if (bubble.variant === 'thought') {
    ctx.ellipse(absX + absW / 2, absY + absH / 2, absW / 2, absH / 2, 0, 0, 2 * Math.PI);
  } else {
    const r = 10;
    ctx.roundRect(absX, absY, absW, absH, r);
  }
  ctx.fill();
  ctx.stroke();

  if (text) {
    ctx.fillStyle = style.color;
    ctx.font = `${style.fontWeight} ${style.fontSize * 2}px ${style.fontFamily}`;
    ctx.textAlign = style.textAlign;
    ctx.textBaseline = 'middle';
    
    const textX = style.textAlign === 'left' ? absX + 20 : 
                  style.textAlign === 'right' ? absX + absW - 20 : 
                  absX + absW / 2;
                  
    ctx.fillText(text, textX, absY + absH / 2, absW - 20);
  }
  ctx.restore();
};

const drawPanel = async (
  ctx: CanvasRenderingContext2D, 
  panel: ComicPanel, 
  pageWidth: number, 
  pageHeight: number
) => {
  if (!panel.imageUrl) return;

  const absX = (panel.x / 100) * pageWidth;
  const absY = (panel.y / 100) * pageHeight;
  const absW = (panel.width / 100) * pageWidth;
  const absH = (panel.height / 100) * pageHeight;

  try {
    const img = await loadImage(panel.imageUrl);
    ctx.save();
    ctx.beginPath();
    ctx.rect(absX, absY, absW, absH);
    ctx.clip();
    
    const scale = panel.imageScale || 1;
    const posX = panel.imagePosition?.x || 50;
    const posY = panel.imagePosition?.y || 50;

    const imgW = absW * scale;
    const imgH = absH * scale;
    const dx = absX + (absW - imgW) * (posX / 100);
    const dy = absY + (absH - imgH) * (posY / 100);

    ctx.drawImage(img, dx, dy, imgW, imgH);
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(absX, absY, absW, absH);
    ctx.restore();
  } catch (error) {
    ctx.save();
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(absX, absY, absW, absH);
    ctx.strokeStyle = '#d1d5db';
    ctx.strokeRect(absX, absY, absW, absH);
    ctx.restore();
  }
};

export const renderPageToBlob = async (
  page: ComicPage, 
  width: number, 
  height: number
): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Canvas context failed');

  ctx.fillStyle = page.backgroundColor || '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const panels = page.elements.filter((e): e is ComicPanel => e.type === 'panel')
    .sort((a, b) => a.zIndex - b.zIndex);
    
  await Promise.allSettled(panels.map(panel => drawPanel(ctx, panel, width, height)));

  const bubbles = page.elements.filter((e): e is SpeechBubble => e.type === 'bubble')
    .sort((a, b) => a.zIndex - b.zIndex);
    
  bubbles.forEach(bubble => drawBubble(ctx, bubble, width, height));

  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas empty'));
      }, 'image/png', 0.95);
    } catch (e) {
      reject(new Error('Canvas export failed'));
    }
  });
};