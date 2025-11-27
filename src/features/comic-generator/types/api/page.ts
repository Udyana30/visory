export interface ApiElement {
  id?: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  layer_index: number;
  image_url?: string;
  text_content?: string;
  properties: any;
}

export interface PageResponse {
  id: number;
  project_id: number;
  page_number: number;
  layout: string;
  background_color: string;
  elements: ApiElement[];
  preview_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PageListResponse {
  data: PageResponse[];
  total: number;
}

export interface SavePageRequest {
  page_number?: number;
  layout?: string;
  background_color?: string;
  elements: ApiElement[];
  is_thumbnail?: boolean;
}

export interface CreatePageRequest {
  page_number: number;
  layout?: string;
  notes?: string;
}