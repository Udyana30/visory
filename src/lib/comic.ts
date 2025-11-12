import {
  Sparkles,
  Palette,
  BookOpen,
  Download
} from 'lucide-react';

import { Character } from '@/types/comic';

export interface ArtStyle {
  id: number;
  name: string;
  preview: string;
  imageUrl: string;
}

export const ONBOARDING_STEPS = [
  {
    icon: Sparkles,
    title: 'Welcome to Comic Generator',
    description: 'Create stunning comics with AI-powered tools. From concept to completion, bring your stories to life with professional-quality artwork.',
    image: '🎨'
  },
  {
    icon: Palette,
    title: 'Choose Your Art Style',
    description: 'Select from various art styles including manga, superhero, cartoon, and more. Each style is crafted to match your creative vision.',
    image: '🖼️'
  },
  {
    icon: BookOpen,
    title: 'Build Your Story',
    description: 'Design characters, create scenes, and craft compelling narratives. Our intuitive editor makes comic creation accessible to everyone.',
    image: '📚'
  },
  {
    icon: Download,
    title: 'Export & Share',
    description: 'Download your comics in high resolution or share them directly with your audience. Multiple export formats available.',
    image: '⬇️'
  }
];

export const ART_STYLES: ArtStyle[] = [
  { 
    id: 1, 
    name: 'Manga', 
    preview: '🎌',
    imageUrl: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=400&fit=crop'
  },
  { 
    id: 2, 
    name: 'Superhero', 
    preview: '🦸',
    imageUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=400&fit=crop'
  },
  { 
    id: 3, 
    name: 'Cartoon', 
    preview: '🎪',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=400&fit=crop'
  },
  { 
    id: 4, 
    name: 'Realistic', 
    preview: '🎭',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop'
  },
  { 
    id: 5, 
    name: 'Anime', 
    preview: '⭐',
    imageUrl: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=400&h=400&fit=crop'
  },
  { 
    id: 6, 
    name: 'Retro', 
    preview: '📻',
    imageUrl: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=400&fit=crop'
  },
  { 
    id: 7, 
    name: 'Watercolor', 
    preview: '🎨',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop'
  },
  { 
    id: 8, 
    name: 'Noir', 
    preview: '🎬',
    imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=400&fit=crop'
  }
];

export const GENRES = [
  'Action', 
  'Adventure', 
  'Comedy', 
  'Drama', 
  'Fantasy', 
  'Horror', 
  'Mystery', 
  'Romance', 
  'Sci-Fi', 
  'Thriller'
];

export const PAGE_SIZES = [
  'Standard (6.625" x 10.25")',
  'US Comic (6.875" x 10.4375")',
  'Manga (5" x 7.5")',
  'Digital (1920 x 2880px)',
  'Square (8" x 8")'
];

export const TIMELINE_STEPS = [
  { label: 'Comic Overview', active: true },
  { label: 'Character Setup', active: false },
  { label: 'Scene Visualization', active: false },
  { label: 'Comic Editor', active: false },
  { label: 'Preview and Export', active: false }
];

export const GENDERS = ['Male', 'Female', 'Non-Binary', 'Other'];

export const AGE_CATEGORIES = ['Child', 'Teenager', 'Young Adult', 'Adult', 'Elder'];

export const DUMMY_CHARACTERS: Character[] = [
  { id: '100', name: 'Dexter', gender: 'Male', age: '28', style: 'Realistic', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
  { id: '102', name: 'Rexola', gender: 'Female', age: '24', style: 'Realistic', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop' },
  { id: '103', name: 'Jax', gender: 'Male', age: '35', style: 'Realistic', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop' },
  { id: '104', name: 'Zoe', gender: 'Female', age: '21', style: 'Realistic', imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop' },
  { id: '105', name: 'Maximus', gender: 'Male', age: '40', style: 'Realistic', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop' },
  { id: '106', name: 'Leona', gender: 'Female', age: '29', style: 'Realistic', imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop' },
  { id: '107', name: 'Orion', gender: 'Male', age: '26', style: 'Realistic', imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop' },
  { id: '108', name: 'Silas', gender: 'Male', age: '31', style: 'Realistic', imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop' },
];