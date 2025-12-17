export interface ApiResponseWrapper<T> {
  data: T;
  message?: string;
  //deleted dibawah jika error
  total?: number;
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