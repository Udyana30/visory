export interface STTFormData {
    title: string;
    language: string;
    audio_file: File | null;
  }
  
  export interface STTRequestData {
    title: string;
    language: string;
    input_audio_file: File;
  }
  
  export interface STTResult {
    id: number;
    title: string;
    input_audio_url: string;
    output_raw_text: string;
    minio_bucket_name: string;
    input_minio_file_path: string;
    output_minio_file_path: string;
    output_srt_url: string;
    last_generated_url: string;
    created_at: string;
    language: string;
  }
  
  export interface STTHistoryItem extends STTResult {}
  
  export interface STTQueryParams {
    order_by?: string;
    order_dir?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }
  
  export interface STTCreateResponse {
    message: string;
    data: STTResult;
  }
  
  export interface STTListResponse {
    message: string;
    data: STTHistoryItem[];
    total?: number;
    page?: number;
    limit?: number;
  }