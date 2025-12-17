export interface ArtStyle {
    id: number;
    name: string;
    apiValue: string;
    preview: string;
    imageUrl: string;
  }
  
  export interface PageSize {
    width: number;
    height: number;
    label?: string;
  }
  
  export type ComicGenre = string;