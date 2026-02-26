

import api from '../lib/axios';
import { Author, AuthorCreate, AuthorResponse } from '../types/author';
export const createAuthor = async (
    payload: AuthorCreate
): Promise<AuthorResponse> => {
    try {
        const response = await api.post("/author/createAuthor", payload);
        console.log("res", response.data);
        return response.data;
    } catch (error: any) {
        throw error;
    }
};
export const getAllAuthor = async () => {
    const response = await api.get("/author/getAuthors");
    console.log("source of author response", response);
    return response?.data;
};
export const updateAuthorById = async (id: number, data: Author): Promise<AuthorResponse> => {
    try {
        console.log("");
        const { name, email } = data;
        const payload = {
            name,
            email
        };
        const res = await api.put(`/author/updateAuthor/${id}`, payload);
        return res.data;
    } catch (err: any) {
        console.error("Update failed:", err.response?.data || err.message);
        throw err;
    }
};

export const deleteAuthorById = async (id: number): Promise<void> => {
    await api.delete(`/author/deleteAuthor/${id}`);
};