/**
 * Cursor-Based Pagination Types
 * Digunakan untuk infinite scroll dan load more functionality
 */

export interface PaginatedResponse<T> {
    /** Array of items untuk halaman saat ini */
    items: T[];

    /** Cursor untuk halaman berikutnya (timestamp dari item terakhir) */
    next_cursor: string | null;

    /** Indicator apakah masih ada data selanjutnya */
    has_more: boolean;
}

export interface PaginationParams {
    /** Jumlah item per halaman (default: 20) */
    limit?: number;

    /** Cursor dari halaman sebelumnya untuk load more */
    cursor?: string | null;
}
