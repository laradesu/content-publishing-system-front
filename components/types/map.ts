
export interface Map {
    id: number;
    latitude: string;
    longitude: string;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface MapCreate {
    latitude: string;
    longitude: string;
    is_active: boolean;
}
export interface MapResponse {
    success: boolean;
    message: string;
    data: Map[];
}