import { useState } from 'react';
import { AvatarParameters } from '../types/domain/project';
import { DEFAULT_AVATAR_PARAMS, DEFAULT_AVATAR_PROMPT } from '../constants/defaults';

interface AvatarFormState {
    title: string;
    description: string;
    prompt: string;
    imageFile: File | null;
    previewUrl: string | undefined;
    params: AvatarParameters;
    audioFile1: File | null;
    audioFile2: File | null;
    audioOrder: string;
    templateModalOpen: boolean;
}

const initialFormState: AvatarFormState = {
    title: '',
    description: '',
    prompt: DEFAULT_AVATAR_PROMPT,
    imageFile: null,
    previewUrl: undefined,
    params: DEFAULT_AVATAR_PARAMS,
    audioFile1: null,
    audioFile2: null,
    audioOrder: 'meanwhile',
    templateModalOpen: false
};

export const useAvatarForm = () => {
    const [formState, setFormState] = useState<AvatarFormState>(initialFormState);

    const updateField = <K extends keyof AvatarFormState>(
        field: K,
        value: AvatarFormState[K]
    ) => {
        setFormState(prev => ({ ...prev, [field]: value }));
    };

    const updateParams = (key: keyof AvatarParameters, value: number) => {
        setFormState(prev => ({
            ...prev,
            params: { ...prev.params, [key]: value }
        }));
    };

    const updateParamsPartial = (newParams: Partial<AvatarParameters>) => {
        setFormState(prev => ({
            ...prev,
            params: { ...prev.params, ...newParams }
        }));
    };

    const handleImageSelect = (file: File) => {
        const url = URL.createObjectURL(file);
        setFormState(prev => ({
            ...prev,
            imageFile: file,
            previewUrl: url
        }));
    };

    const handleTemplateSelect = (imageUrl: string) => {
        setFormState(prev => ({
            ...prev,
            imageFile: null,
            previewUrl: imageUrl,
            templateModalOpen: false
        }));
    };

    const reset = () => {
        setFormState(initialFormState);
    };

    return {
        formState,
        updateField,
        updateParams,
        updateParamsPartial,
        handleImageSelect,
        handleTemplateSelect,
        reset
    };
};
