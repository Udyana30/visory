export interface ComicGalleryItem {
  id: number;
  title: string;
  description: string;
  coverUrl: string | null;
  downloadUrl: string | null;
  stats: {
    views: number;
    rating: number;
    reviews: number;
    pages: number;
  };
  metadata: {
    genre: string;
    artStyle: string;
    language: string;
    createdAt: Date;
  };
  authorId: number;
}

export interface ComicReview {
  id: number;
  rating: number;
  comment: string;
  createdAt: Date;
  userId: number;
}