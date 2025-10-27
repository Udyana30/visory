export interface STTQueryParams {
    order_by?: string;
    order_dir?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
  
export interface STTResponse {
    id: string;
    text: string;
    audioUrl?: string;
    language?: string;
    createdAt?: string;
    [key: string]: any;
}
  
export interface STTCreateResponse {
    id: string;
    text: string;
    confidence?: number;
    duration?: number;
    createdAt?: string;
    [key: string]: any;
}
  