export interface Voice {
  id: string;
  name: string;
  language: string;
  gender: 'Male' | 'Female';
}

export interface TTSFormData {
  title: string;
  input_text: string;
  voice_name: string;
  language: string;
  rate: number;
  volume: number;
  pitch: number;
}

export interface TTSPayload {
  title: string;
  input_text: string;
  voice_name: string;
  rate: string;
  volume: string;
  pitch: string;
}

export interface TTSResult {
  id: number;
  title: string;
  voice_name: string;
  output_speech_url: string;
  created_at: string;
  input_text?: string;
  rate?: string;
  volume?: string;
  pitch?: string;
  minio_bucket_name?: string;
  output_minio_file_path?: string;
  last_generated_url?: string;
}

export interface TTSHistoryItem extends TTSResult {
  duration?: number;
}

export interface SliderConfig {
  label: string;
  name: keyof Pick<TTSFormData, 'rate' | 'volume' | 'pitch'>;
  min: number;
  max: number;
  step: number;
  unit: string;
}

export interface TTSRequestData {
  title: string;
  input_text: string;
  voice_name: string;
  rate: string;
  volume: string;
  pitch: string;
  language?: string;
  format?: string;
}

export interface TTSResponse {
  success?: boolean;
  message?: string;
  data: TTSResult;
}

export interface TTSListResponse {
  success?: boolean;
  message?: string;
  data: TTSResult[];
  total_row?: number;
  page?: number;
  limit?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface TTSQueryParams {
  order_by?: string;
  order_dir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}