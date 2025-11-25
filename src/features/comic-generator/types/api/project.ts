import { ApiResponseWrapper } from "../common";

export interface PageSizeDTO {
  width: number;
  height: number;
}

export interface CreateProjectRequest {
  name: string;
  page_size: PageSizeDTO;
  art_style: string;
}

export interface ProjectResponse {
  id: number;
  name: string;
  page_size: PageSizeDTO;
  art_style: string;
  created_at: string;
  updated_at: string;
}

export type ComicListResponse = ApiResponseWrapper<ProjectResponse[]>;