export interface Profile {
    id: number;
    title: string;
    icon: string;
    link: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProfileResponse {
    success: boolean;
    message: string;
    data: Profile[];
}