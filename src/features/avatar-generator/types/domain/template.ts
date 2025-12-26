export interface AvatarTemplate {
    avatar_id: string;
    user_id: string;
    name: string;
    image_url: string;
    created_at: string;
}

export interface CreateTemplatePayload {
    name: string;
    file: File;
    userId: string;
}
