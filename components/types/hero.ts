export interface Hero {
    id: number;
    image: string;
    is_active:boolean;
    createdAt: string;
    updatedAt: string;
}

export interface HeroResponse {
    success: boolean;
    message: string;
    data: Hero[];
}
export interface HeroCreate {
    image: string;
    is_active:boolean;
}