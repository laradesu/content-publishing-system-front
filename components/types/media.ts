export interface Media {
    id: number;
    title: string;
    icon: string;
    link: string;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface MediaResponse {
    success: boolean;
    message: string;
    data: Media[];
}
export interface MediaCreate {
    title: string;
    icon: string;
    link: string;
    is_active: boolean;
}