interface AvatarFormValidation {
    isValid: boolean;
    errors: {
        image: string | null;
        audio: string | null;
        title: string | null;
    };
}

interface AvatarFormData {
    title: string;
    imageFile: File | null;
    previewUrl: string | undefined;
    audioFile1: File | null;
    audioFile2: File | null;
}

export const validateAvatarForm = (formData: AvatarFormData): AvatarFormValidation => {
    const hasImage = !!(formData.imageFile || formData.previewUrl);
    const hasAudio = !!(formData.audioFile1 || formData.audioFile2);
    const hasTitle = formData.title.trim().length > 0;

    return {
        isValid: hasImage && hasAudio && hasTitle,
        errors: {
            image: !hasImage ? 'Source image is required' : null,
            audio: !hasAudio ? 'At least one audio file is required' : null,
            title: !hasTitle ? 'Project title is required' : null
        }
    };
};

export const getAvatarType = (hasAudio1: boolean, hasAudio2: boolean): 'single_person' | 'multi_person' => {
    return (hasAudio1 && hasAudio2) ? 'multi_person' : 'single_person';
};
