import apiClient from '@/lib/apiClient';
import { 
  ComicGalleryListResponse, 
  ComicGalleryItemResponse, 
  ReviewListResponse,
  CreateReviewRequest, 
  ReviewResponse 
} from '../types/api';
import { ComicGalleryItem, ComicReview } from '../types/domain';
import { PaginationParams } from '@/types/common';

const mapToDomain = (item: ComicGalleryItemResponse): ComicGalleryItem => ({
  id: item.id,
  title: item.name,
  description: item.description,
  coverUrl: item.thumbnail_url || item.exported_url, 
  downloadUrl: item.exported_url,
  stats: {
    views: item.view_count,
    rating: item.average_rating,
    reviews: item.review_count,
    pages: item.pages_count || 0
  },
  metadata: {
    genre: item.genre,
    artStyle: item.art_style,
    language: item.language,
    createdAt: new Date(item.created_at)
  },
  authorId: item.user_id
});

const mapReviewToDomain = (item: ReviewResponse): ComicReview => ({
  id: item.id,
  rating: item.rating,
  comment: item.comment,
  createdAt: new Date(item.created_at),
  userId: item.user_id
});

export const galleryService = {
  getAll: async (params?: PaginationParams): Promise<{ data: ComicGalleryItem[], total: number }> => {
    const response = await apiClient.get<ComicGalleryListResponse>('/service/comic/gallery', { params });
    return {
      data: response.data.data.map(mapToDomain),
      total: response.data.total || 0
    };
  },

  getById: async (id: number): Promise<ComicGalleryItem> => {
    const response = await apiClient.get<ComicGalleryItemResponse>(`/service/comic/gallery/${id}`);
    return mapToDomain(response.data);
  },

  getReviews: async (id: number): Promise<ComicReview[]> => {
    const response = await apiClient.get<ReviewListResponse>(`/service/comic/gallery/${id}/reviews`);
    return response.data.data.map(mapReviewToDomain);
  },

  createReview: async (id: number, data: CreateReviewRequest): Promise<ComicReview> => {
    const response = await apiClient.post<ReviewResponse>(`/service/comic/gallery/${id}/reviews`, data);
    return mapReviewToDomain(response.data);
  }
};