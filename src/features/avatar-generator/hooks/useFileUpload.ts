import { useState } from 'react';
import { uploadService, UploadResponse } from '../services/uploadService';

interface UseFileUploadReturn {
  uploadFile: (file: File) => Promise<UploadResponse | null>;
  deleteFile: (fileId: string) => Promise<boolean>;
  isUploading: boolean;
  error: string | null;
}

export const useFileUpload = (): UseFileUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<UploadResponse | null> => {
    setIsUploading(true);
    setError(null);

    try {
      const response = await uploadService.uploadFile(file);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload file';
      setError(message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (fileId: string): Promise<boolean> => {
    try {
      await uploadService.deleteFile(fileId);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error';
      console.warn(`Failed to delete file ${fileId}:`, errorMessage);
      return false;
    }
  };

  return { uploadFile, deleteFile, isUploading, error };
};