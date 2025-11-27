import { useCallback } from 'react';

export const useCanvasMath = (canvasWidth: number, canvasHeight: number) => {
  const toPercent = useCallback((pxValue: number, dimension: number) => {
    return (pxValue / dimension) * 100;
  }, []);

  const toPx = useCallback((percentValue: number, dimension: number) => {
    return (percentValue / 100) * dimension;
  }, []);

  return { toPercent, toPx };
};