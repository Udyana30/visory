import { PageSizeDTO } from '../api/project';

export interface ArtStyle {
  id: number;
  name: string;
  apiValue: string;
  preview: string;
  imageUrl: string;
}

export interface ProjectFormData {
  name: string;
  genre: string;
  pageSizeLabel: string;
  artStyleIndex: number | null;
}

export interface Project {
  id: string;
  name: string;
  genre?: string;
  artStyle: string;
  pageSize: PageSizeDTO;
  createdAt: Date;
}