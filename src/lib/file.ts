import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isImageFile = (url: string | null): boolean => {
  if (!url) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'];
  const lowerUrl = url.toLowerCase();
  return imageExtensions.some(ext => lowerUrl.includes(ext));
};

export const getFileType = (url: string | null): 'pdf' | 'cbz' | 'image' | 'unknown' => {
  if (!url) return 'unknown';
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('.pdf')) return 'pdf';
  if (lowerUrl.includes('.cbz')) return 'cbz';
  if (isImageFile(url)) return 'image';
  return 'unknown';
};