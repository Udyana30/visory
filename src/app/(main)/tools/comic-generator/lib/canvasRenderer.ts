import { ComicPage } from '../types/editor';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1440;

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
};

const drawBubblePath = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
  type: string,
  showTail: boolean
) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  
  if (showTail && (type === 'speech' || type === 'shout')) {
    const tailX = x + (w * 0.2);
    const tailW = 20; 
    
    ctx.lineTo(tailX + tailW, y + h);
    ctx.lineTo(tailX + (tailW/2) - 5, y + h + 15); 
    ctx.lineTo(tailX, y + h);
  }
  
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

export const renderPageToCanvas = async (page: ComicPage): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.fillStyle = page.backgroundColor || '#ffffff';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const validPanels = page.panels.filter(
    panel => panel.imageUrl && panel.imageUrl.trim() !== ''
  );

  for (const panel of validPanels) {
    const panelX = (panel.x / 100) * CANVAS_WIDTH;
    const panelY = (panel.y / 100) * CANVAS_HEIGHT;
    const panelWidth = (panel.width / 100) * CANVAS_WIDTH;
    const panelHeight = (panel.height / 100) * CANVAS_HEIGHT;

    try {
      const img = await loadImage(panel.imageUrl);

      ctx.save();
      ctx.translate(panelX + panelWidth / 2, panelY + panelHeight / 2);
      if (panel.rotation) {
        ctx.rotate((panel.rotation * Math.PI) / 180);
      }
      ctx.drawImage(img, -panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight);
      ctx.restore();
    } catch (error) {
      console.error(`Failed to load panel image: ${panel.imageUrl}`, error);
    }
  }

  if (page.bubbles) {
    for (const bubble of page.bubbles) {
      const bubbleX = (bubble.x / 100) * CANVAS_WIDTH;
      const bubbleY = (bubble.y / 100) * CANVAS_HEIGHT;
      const bubbleWidth = (bubble.width / 100) * CANVAS_WIDTH;
      const bubbleHeight = (bubble.height / 100) * CANVAS_HEIGHT;

      ctx.fillStyle = bubble.backgroundColor;
      ctx.strokeStyle = bubble.borderColor;
      ctx.lineWidth = bubble.borderWidth;

      let radius = 16;
      if (bubble.type === 'thought') radius = bubbleWidth / 2;
      if (bubble.type === 'narration') radius = 0;

      if (bubble.type === 'thought') {
        ctx.beginPath();
        ctx.ellipse(bubbleX + bubbleWidth/2, bubbleY + bubbleHeight/2, bubbleWidth/2, bubbleHeight/2, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        if (bubble.showTail !== false) {
          ctx.beginPath();
          ctx.arc(bubbleX + bubbleWidth * 0.2, bubbleY + bubbleHeight + 10, 6, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(bubbleX + bubbleWidth * 0.25, bubbleY + bubbleHeight + 20, 4, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
        }
      } else {
        drawBubblePath(ctx, bubbleX, bubbleY, bubbleWidth, bubbleHeight, radius, bubble.type, bubble.showTail !== false);
        ctx.fill();
        ctx.stroke();
      }

      if (bubble.text) {
        ctx.fillStyle = bubble.color;
        const fontStyle = bubble.fontStyle || 'normal';
        const fontWeight = bubble.fontWeight || 'normal';
        ctx.font = `${fontStyle} ${fontWeight} ${bubble.fontSize}px ${bubble.fontFamily}`;
        ctx.textAlign = bubble.textAlign;
        ctx.textBaseline = 'middle';

        const lines = wrapText(ctx, bubble.text, bubbleWidth - 20);
        const lineHeight = bubble.fontSize * 1.2;
        const totalHeight = lines.length * lineHeight;
        const startY = bubbleY + bubbleHeight / 2 - totalHeight / 2 + lineHeight / 2;

        lines.forEach((line, index) => {
          let textX = bubbleX + bubbleWidth / 2;
          if (bubble.textAlign === 'left') {
            textX = bubbleX + 10;
          } else if (bubble.textAlign === 'right') {
            textX = bubbleX + bubbleWidth - 10;
          }
          ctx.fillText(line, textX, startY + index * lineHeight);
        });
      }
    }
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      },
      'image/png',
      0.95
    );
  });
};