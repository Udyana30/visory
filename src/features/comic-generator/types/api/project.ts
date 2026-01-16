import { ApiResponseWrapper } from "../../../../types/common";

export interface PageSizeDTO {
  width: number;
  height: number;
}

export interface CreateProjectRequest {
  name: string;
  page_size: PageSizeDTO;
  art_style: string;
  description: string;
  genre: string;
  language: string;
}

export interface UpdateProjectRequest {
  name?: string;
  page_size?: PageSizeDTO;
  art_style?: string;
  description?: string;
  genre?: string;
  language?: string;
  is_public?: boolean;
}

export interface ProjectResponse {
  id: number;
  name: string;
  page_size: PageSizeDTO;
  art_style: string;
  exported_url: string | null;
  description: string;
  genre: string;
  language: string;
  is_public: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export type ComicListResponse = ApiResponseWrapper<ProjectResponse[]>;