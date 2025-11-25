export interface ApiResponseWrapper<T> {
  data: T;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}