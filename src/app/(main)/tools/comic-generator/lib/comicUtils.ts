import { PageSize } from '@/types/comic';

export const pageSizeMap: Record<string, PageSize> = {
  'Standard (6.625" x 10.25")': { width: 800, height: 1240 },
  'US Comic (6.875" x 10.4375")': { width: 825, height: 1260 },
  'Manga (5" x 7.5")': { width: 600, height: 900 },
  'Digital (1920 x 2880px)': { width: 1920, height: 2880 },
  'Square (8" x 8")': { width: 960, height: 960 },
};

export const artStyleMap: Record<string, string> = {
  'Manga': 'manga',
  'Superhero': 'comics',
  'Cartoon': 'kids',
  'Realistic': 'sketch',
  'Anime': 'manwha',
  'Retro': 'medieval',
  'Watercolor': 'vector',
  'Noir': 'strip',
};

export const getPageSize = (pageSizeLabel: string): PageSize => {
  return pageSizeMap[pageSizeLabel] || { width: 800, height: 1280 };
};

export const getArtStyle = (styleName: string): string => {
  return artStyleMap[styleName] || 'comics';
};