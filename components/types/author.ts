export interface Author {
    id: number;
    name: string;
    email: string;
    created_at?: string;
    updated_at?: string;
}

export interface AuthorCreate {
    name: string;
    email: string;
}
export interface AuthorResponse {
    success: boolean;
    message: string;
    data: Author[];
}