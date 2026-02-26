
export interface Article {
    id: number;
    title: string;
    body: string;
    tags: string[];
    is_published: boolean;
    author_id: number;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
}
export interface ArticleCreate {
    title: string;
    body: string;
    tags: string[];
    is_published: boolean;
    author_id: number;
}
export interface ArticleResponse {
    success: boolean;
    message: string;
    data: Article[];
}
