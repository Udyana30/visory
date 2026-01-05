import { useState } from 'react';
import { useFileUpload } from './useFileUpload';
import { useAvatarActions } from './useAvatarActions';
import { AvatarParameters } from '../types/domain/project';
import { getAvatarType } from '../utils/avatarValidation';

interface SubmitData {
    userId: string;
    title: string;
    description?: string;
    prompt: string;
    imageFile: File | null;
    previewUrl: string | undefined;
    audioFile1: File | null;
    audioFile2: File | null;
    audioOrder: string;
    params: AvatarParameters;
}

interface UploadResult {
    url?: string;
    id_file?: string;
}

export const useAvatarSubmission = () => {
    const { uploadFile, deleteFile, isUploading, error: uploadError } = useFileUpload();
    const { createAvatar, isCreating, error: submitError } = useAvatarActions();
    const [isProcessing, setIsProcessing] = useState(false);

    const submit = async (data: SubmitData): Promise<void> => {
        setIsProcessing(true);

        try {
            // 1. Parallel Upload
            const uploadPromises = [
                data.imageFile ? uploadFile(data.imageFile) : Promise.resolve(null),
                data.audioFile1 ? uploadFile(data.audioFile1) : Promise.resolve(null),
                data.audioFile2 ? uploadFile(data.audioFile2) : Promise.resolve(null),
            ];

            const [imageResult, audioResult1, audioResult2] = await Promise.all(uploadPromises);

            const uploadedImageUrl = imageResult?.url;
            const uploadedAudioUrl1 = audioResult1?.url;
            const uploadedAudioUrl2 = audioResult2?.url;

            // 2. Validate Upload Results
            if (data.imageFile && !uploadedImageUrl) {
                throw new Error("Failed to upload source image.");
            }
            if (data.audioFile1 && !uploadedAudioUrl1) {
                throw new Error("Failed to upload primary audio.");
            }
            if (data.audioFile2 && !uploadedAudioUrl2) {
                throw new Error("Failed to upload secondary audio.");
            }

            // 3. Determine Final URLs
            const finalImageUrl = data.imageFile ? uploadedImageUrl : data.previewUrl;
            if (!finalImageUrl) {
                throw new Error("No image source available.");
            }

            const finalAudioUrl = uploadedAudioUrl1 || uploadedAudioUrl2;
            if (!finalAudioUrl) {
                throw new Error("No audio uploaded.");
            }

            const isMultiPerson = !!uploadedAudioUrl1 && !!uploadedAudioUrl2;
            const avatarType = getAvatarType(!!uploadedAudioUrl1, !!uploadedAudioUrl2);

            // 4. Create Avatar Project
            await createAvatar({
                userId: data.userId,
                title: data.title,
                description: data.description,
                prompt: data.prompt,
                imageUrl: finalImageUrl,
                audioUrl: finalAudioUrl,
                parameters: data.params,
                type: avatarType,
                audioOrder: isMultiPerson ? data.audioOrder : undefined,
                ...(isMultiPerson && { audioUrl2: uploadedAudioUrl2 } as any)
            });

            // 5. Cleanup Uploaded Files (DISABLED)
            // IMPORTANT: Files must remain available for Modal API to download
            // Deleting files immediately causes "cannot identify image file" errors
            // Cleanup should be handled by:
            // - Cloudinary retention policy (auto-delete after 24-48 hours)
            // - Backend cleanup after successful generation
            /* 
            const filesToDelete = [
                imageResult?.id_file,
                audioResult1?.id_file,
                audioResult2?.id_file
            ].filter((id): id is string => !!id);

            if (filesToDelete.length > 0) {
                Promise.all(filesToDelete.map(id => deleteFile(id)))
                    .catch(err => console.error("Failed to cleanup files:", err));
            }
            */

        } finally {
            setIsProcessing(false);
        }
    };

    return {
        submit,
        isSubmitting: isCreating || isUploading || isProcessing,
        error: submitError || uploadError
    };
};
