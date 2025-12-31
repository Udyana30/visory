/**
 * Formatting utilities for TTS features
 */

// ============================================================================
// DATE FORMATTING
// ============================================================================

/**
 * Format date string to readable format
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Jan 1, 12:00 AM")
 */
export const formatDate = (dateString: string): string => {
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param dateString - ISO date string
 * @returns Relative time string
 */
export const formatRelativeTime = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return 'Just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 604800) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else {
            return formatDate(dateString);
        }
    } catch (error) {
        console.error('Error formatting relative time:', error);
        return dateString;
    }
};

// ============================================================================
// FILE SIZE FORMATTING
// ============================================================================

/**
 * Format bytes to human-readable file size
 * @param bytes - File size in bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted file size (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

// ============================================================================
// DURATION FORMATTING
// ============================================================================

/**
 * Format seconds to duration string
 * @param seconds - Duration in seconds
 * @returns Formatted duration (e.g., "1:23" or "1:23:45")
 */
export const formatDuration = (seconds: number): string => {
    if (!seconds || seconds < 0) return '0:00';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
};

// ============================================================================
// TEXT FORMATTING
// ============================================================================

/**
 * Truncate text to specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length (default: 100)
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
    if (!text || text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
};

/**
 * Capitalize first letter of string
 * @param text - Text to capitalize
 * @returns Capitalized text
 */
export const capitalizeFirst = (text: string): string => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Convert snake_case to Title Case
 * @param text - Snake case text
 * @returns Title case text
 */
export const snakeToTitleCase = (text: string): string => {
    if (!text) return '';
    return text
        .split('_')
        .map(word => capitalizeFirst(word))
        .join(' ');
};

// ============================================================================
// NUMBER FORMATTING
// ============================================================================

/**
 * Format number with thousand separators
 * @param num - Number to format
 * @returns Formatted number (e.g., "1,234,567")
 */
export const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US');
};

/**
 * Format percentage
 * @param value - Value between 0 and 1
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage (e.g., "75%")
 */
export const formatPercentage = (value: number, decimals: number = 0): string => {
    return `${(value * 100).toFixed(decimals)}%`;
};
