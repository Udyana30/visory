import { ApiResponseWrapper } from "@/types/common";

export interface ComicGalleryItemResponse {
  id: number;
  name: string;
  art_style: string;
  genre: string;
  language: string;
  description: string;
  view_count: number;
  thumbnail_url: string | null;
  exported_url: string | null;
  created_at: string;
  user_id: number;
  average_rating: number;
  review_count: number;
  pages_count: number | null;
}

export interface ReviewResponse {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  user_id: number;
}

export interface CreateReviewRequest {
  rating: number;
  comment: string;
}

export type ComicGalleryListResponse = ApiResponseWrapper<ComicGalleryItemResponse[]>;
export type ReviewListResponse = ApiResponseWrapper<ReviewResponse[]>;