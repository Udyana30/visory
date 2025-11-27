import { ComicPage, ComicPanel, SpeechBubble } from '../types/domain/editor';
import { DEFAULT_PAGE_WIDTH, DEFAULT_PAGE_HEIGHT } from '../constants/editor';

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

const drawBubble = (ctx: CanvasRenderingContext2D, bubble: SpeechBubble) => {
  const { x, y, width, height, style, text } = bubble;
  
  const absX = (x / 100) * DEFAULT_PAGE_WIDTH;
  const absY = (y / 100) * DEFAULT_PAGE_HEIGHT;
  const absW = (width / 100) * DEFAULT_PAGE_WIDTH;
  const absH = (height / 100) * DEFAULT_PAGE_HEIGHT;

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

const drawPanel = async (ctx: CanvasRenderingContext2D, panel: ComicPanel) => {
  if (!panel.imageUrl) return;

  const absX = (panel.x / 100) * DEFAULT_PAGE_WIDTH;
  const absY = (panel.y / 100) * DEFAULT_PAGE_HEIGHT;
  const absW = (panel.width / 100) * DEFAULT_PAGE_WIDTH;
  const absH = (panel.height / 100) * DEFAULT_PAGE_HEIGHT;

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
    console.error('Failed to render panel image', error);
  }
};

export const renderPageToBlob = async (page: ComicPage): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  canvas.width = DEFAULT_PAGE_WIDTH;
  canvas.height = DEFAULT_PAGE_HEIGHT;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Canvas context creation failed');

  ctx.fillStyle = page.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const panels = page.elements.filter((e): e is ComicPanel => e.type === 'panel').sort((a, b) => a.zIndex - b.zIndex);
  for (const panel of panels) {
    await drawPanel(ctx, panel);
  }

  const bubbles = page.elements.filter((e): e is SpeechBubble => e.type === 'bubble').sort((a, b) => a.zIndex - b.zIndex);
  for (const bubble of bubbles) {
    drawBubble(ctx, bubble);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Blob conversion failed'));
    }, 'image/png', 0.95);
  });
};