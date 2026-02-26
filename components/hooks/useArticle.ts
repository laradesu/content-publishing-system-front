// hooks/useMember.ts
import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import { Article, ArticleCreate, ArticleResponse } from '../types/article';
import { createArticle, deleteArticleById, getAllArticle, updateArticleById } from "../services/articleService";
export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ArticleCreate) => createArticle(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article'] }); // REFRESH the list
    },
  });
};

export const useGetAllArticle= () => {
  return useQuery<ArticleResponse>({
    queryKey: ["article"],
    queryFn: async () => {
      const res: ArticleResponse = await getAllArticle(); 
      return res; 
    },
  });
};

// Update article
export const useUpdateArticle= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Article) => updateArticleById(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article'] });
    },
  });
};

// Delete article
export const useDeleteArticle= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteArticleById(id),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['article'] });
    },
  });
};