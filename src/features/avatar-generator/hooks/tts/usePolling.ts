import { useRef, useCallback, useEffect } from 'react';
import { POLLING_CONFIG } from '../../utils/constants';

export const usePolling = <T>(
    checkStatus: (id: string) => Promise<T>,
    isComplete: (data: T) => boolean,
    isFailed: (data: T) => boolean,
    options: { interval?: number; maxAttempts?: number } = {}
) => {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const attemptsRef = useRef(0);
    const isPollingRef = useRef(false);

    const {
        interval = POLLING_CONFIG.INTERVAL,
        maxAttempts = POLLING_CONFIG.MAX_ATTEMPTS
    } = options;

    const stopPolling = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        isPollingRef.current = false;
        attemptsRef.current = 0;
    }, []);

    const startPolling = useCallback((
        id: string,
        onUpdate: (data: T) => void,
        onError?: (error: any) => void
    ) => {
        stopPolling();
        isPollingRef.current = true;

        const poll = async () => {
            if (!isPollingRef.current) return;

            try {
                attemptsRef.current++;

                if (attemptsRef.current > maxAttempts) {
                    stopPolling();
                    if (onError) onError(new Error('Polling timed out (max attempts reached)'));
                    return;
                }

                const data = await checkStatus(id);

                onUpdate(data);

                if (isComplete(data)) {
                    stopPolling();
                } else if (isFailed(data)) {
                    stopPolling();
                    if (onError) onError(new Error('Operation failed based on status check'));
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.error('Polling error:', errorMessage, error);
                stopPolling();
                if (onError) onError(error);
            }
        };

        poll();

        intervalRef.current = setInterval(poll, interval);
    }, [checkStatus, isComplete, isFailed, interval, maxAttempts, stopPolling]);

    useEffect(() => {
        return () => stopPolling();
    }, [stopPolling]);

    return {
        startPolling,
        stopPolling,
        isPolling: isPollingRef.current
    };
};
