export interface Photo {
    id: number;
    title: string;
    image: string;
    is_active:boolean;
    createdAt: string;
    updatedAt: string;
}

export interface PhotoResponse {
    success: boolean;
    message: string;
    data: Photo[];
}
export interface PhotoCreate {
    title: string;
    image: string;
    is_active:boolean;
}

export interface Video {
    id: number;
    title: string;
    video: string;
    is_active:boolean;
    createdAt: string;
    updatedAt: string;
}

export interface VideoResponse {
    success: boolean;
    message: string;
    data: Video[];
}
export interface VideoCreate {
    title: string;
    video: string;
    is_active:boolean;
}