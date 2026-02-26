// hooks/Autor.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAuthor, deleteAuthorById, getAllAuthor, updateAuthorById } from "../services/authorService";
import { Author, AuthorCreate, AuthorResponse } from "../types/author";
export const useCreateAuthor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: AuthorCreate) => createAuthor(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['author'] }); // REFRESH the list
        },
    });
};

export const useGetAllAuthor = () => {
    return useQuery<AuthorResponse>({
        queryKey: ["author"],
        queryFn: async () => {
            const res: AuthorResponse = await getAllAuthor();
            return res;
        },
    });
};


// Update author
export const useUpdateAuthor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Author) => updateAuthorById(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['author'] });
        },
    });
};

// Delete boradmember
export const useDeleteAuthor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteAuthorById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['author'] });
        },
    });
};