import { PageSizeDTO } from '../features/comic-generator/types/api/project';
import { ArtStyle } from '../features/comic-generator/types/domain/project';
import { FileText, BookOpen, Smartphone, Square, Monitor } from 'lucide-react';

export const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 
  'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller'
];

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'jp', name: 'Japanese', flag: '🇯🇵' },
  { code: 'kr', name: 'Korean', flag: '🇰🇷' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
];

export const PAGE_SIZES_MAP: Record<string, PageSizeDTO> = {
  'Standard': { width: 800, height: 1240 },
  'US Comic': { width: 825, height: 1260 },
  'Manga': { width: 600, height: 900 },
  'Digital': { width: 1920, height: 2880 },
  'Square': { width: 960, height: 960 },
};

export const PAGE_SIZE_DETAILS = [
  { label: 'Standard', dimensions: '800 x 1240', icon: FileText },
  { label: 'US Comic', dimensions: '825 x 1260', icon: BookOpen },
  { label: 'Manga', dimensions: '600 x 900', icon: BookOpen },
  { label: 'Digital', dimensions: '1920 x 2880', icon: Smartphone },
  { label: 'Square', dimensions: '960 x 960', icon: Square },
];

export const ART_STYLES: ArtStyle[] = [
  { 
    id: 1, 
    name: 'Manga', 
    apiValue: 'manga', 
    preview: '🎌',
    imageUrl: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=400&fit=crop'
  },
  { 
    id: 2, 
    name: 'Superhero', 
    apiValue: 'comics', 
    preview: '🦸',
    imageUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=400&fit=crop'
  },
  { 
    id: 3, 
    name: 'Cartoon', 
    apiValue: 'kids', 
    preview: '🎪',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=400&fit=crop'
  },
  { 
    id: 4, 
    name: 'Realistic', 
    apiValue: 'sketch', 
    preview: '🎭',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop'
  },
  { 
    id: 5, 
    name: 'Anime', 
    apiValue: 'manwha', 
    preview: '⭐',
    imageUrl: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=400&h=400&fit=crop'
  },
  { 
    id: 6, 
    name: 'Retro', 
    apiValue: 'medieval', 
    preview: '📻',
    imageUrl: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=400&fit=crop'
  },
  { 
    id: 7, 
    name: 'Watercolor', 
    apiValue: 'vector', 
    preview: '🎨',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop'
  },
  { 
    id: 8, 
    name: 'Noir', 
    apiValue: 'strip', 
    preview: '🎬',
    imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=400&fit=crop'
  }
];