import { useState } from 'react';

export interface CreateTemplateFormData {
    name: string;
    file: File | null;
    preview: string | null;
    isPublic: boolean;
}

export const useCreateTemplateForm = () => {
    const [name, setName] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isPublic, setIsPublic] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const removePreview = () => {
        if (preview) {
            URL.revokeObjectURL(preview);
        }
        setFile(null);
        setPreview(null);
    };

    const reset = () => {
        if (preview) {
            URL.revokeObjectURL(preview);
        }
        setName('');
        setFile(null);
        setPreview(null);
        setIsPublic(false);
    };

    const togglePublic = () => {
        setIsPublic(prev => !prev);
    };

    return {
        formData: {
            name,
            file,
            preview,
            isPublic
        },
        setName,
        setIsPublic,
        togglePublic,
        handleFileSelect,
        removePreview,
        reset,
        isValid: !!name.trim() && !!file
    };
};
