export interface ComicInitData {
    title: string;
    description?: string;
    genre?: string;
    characterPrompt?: string;
    style?: string;
    [key: string]: any;
}
  
export interface ComicSelectStoryData {
    storyId: string;
    [key: string]: any;
}
  
export interface ComicFinalizeData {
    selectedScenes: string[];
    soundtrack?: string;
    [key: string]: any;
}
  
export interface Comic {
    id: string;
    title: string;
    description?: string;
    genre?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: any;
}
  
export interface ComicQueryParams {
    order_by?: string;
    order_dir?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
  
export interface ComicResponse {
    success: boolean;
    data: Comic;
    message?: string;
    [key: string]: any;
}
  
export interface ComicListResponse {
    success: boolean;
    data: Comic[];
    total?: number;
    page?: number;
    limit?: number;
    [key: string]: any;
}
  