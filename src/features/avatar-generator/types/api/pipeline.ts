/**
 * Multi-Stage Async Pipeline Types
 * Digunakan untuk tracking progress granular pada proses AI
 */

/** Status dari setiap stage dalam pipeline */
export type PipelineStageStatus = 'pending' | 'active' | 'completed' | 'failed';

/** Key identifier untuk setiap stage */
export type PipelineStageKey =
    | 'SETUP'           // Download model, load LoRA, init GPU
    | 'INFERENCE'       // AI processing (frame-by-frame generation)
    | 'POST_PROCESS'    // FFmpeg video + audio merging
    | 'UPLOADING';      // Upload ke Cloudinary

/** Detail informasi untuk satu stage dalam pipeline */
export interface PipelineStage {
    /** Unique key untuk stage */
    key: PipelineStageKey;

    /** Label yang ditampilkan ke user (bahasa Indonesia) */
    label: string;

    /** Status stage saat ini */
    status: PipelineStageStatus;

    /** Progress dalam stage ini (0-100), hanya ada jika status = 'active' */
    progress?: number;

    /** Timestamp kapan stage selesai */
    completed_at?: string;

    /** Error message jika status = 'failed' */
    error_message?: string;
}

/** Pipeline object yang berisi semua stages */
export interface Pipeline {
    /** Array of stages yang dijalankan secara sequential */
    stages: PipelineStage[];
}
