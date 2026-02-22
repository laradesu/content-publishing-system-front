export type Comment = {
    id?: number;
    full_name?: string;
    email?: string;
    phone: string;
    message: string;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
};
export type CommentCreate = {
    full_name?: string;
    email?: string;
    phone: string;
    message: string;
    is_active: boolean;
};
export type CommentResponse = {
    success: boolean;
    message?: string;
    data?: Comment[];
};