export interface TTSRequestData {
    text: string;
    voice?: string;
    language?: string;
    format?: string;
}
  
export interface TTSResponse {
    id: string;
    url: string;
    duration?: number;
    createdAt?: string;
    [key: string]: any;
}
  
export interface TTSQueryParams {
    order_by?: string;
    order_dir?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
  