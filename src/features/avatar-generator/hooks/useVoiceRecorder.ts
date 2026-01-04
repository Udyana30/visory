import { useState, useRef, useCallback } from 'react';

interface UseVoiceRecorderReturn {
    isRecording: boolean;
    recordingTime: number;
    audioBlob: Blob | null;
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<File | null>;
    cancelRecording: () => void;
    error: string | null;
}

export const useVoiceRecorder = (): UseVoiceRecorderReturn => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startRecording = useCallback(async () => {
        try {
            setError(null);

            // Request microphone permission
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Create MediaRecorder
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            // Handle data available
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            // Start recording
            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);

            // Start timer
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);

        } catch (err: any) {
            setError(err.message || 'Failed to start recording');
            console.error('Recording error:', err);
        }
    }, []);

    const stopRecording = useCallback(async (): Promise<File | null> => {
        return new Promise((resolve) => {
            if (!mediaRecorderRef.current || !isRecording) {
                resolve(null);
                return;
            }

            mediaRecorderRef.current.onstop = () => {
                // Create blob from chunks
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);

                // Convert to File
                const file = new File(
                    [blob],
                    `recording-${Date.now()}.webm`,
                    { type: 'audio/webm' }
                );

                // Cleanup
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                }

                // Stop all tracks
                mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());

                setIsRecording(false);
                resolve(file);
            };

            mediaRecorderRef.current.stop();
        });
    }, [isRecording]);

    const cancelRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();

            // Cleanup
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }

            // Stop all tracks
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());

            chunksRef.current = [];
            setAudioBlob(null);
            setRecordingTime(0);
            setIsRecording(false);
        }
    }, [isRecording]);

    return {
        isRecording,
        recordingTime,
        audioBlob,
        startRecording,
        stopRecording,
        cancelRecording,
        error
    };
};
