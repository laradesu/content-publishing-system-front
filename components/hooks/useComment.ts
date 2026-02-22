
import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import { CommentResponse } from "../types/comment";
import { deleteCommentById, getAllCommet } from "../services/commentService";

export const useGetAllComment= () => {
  return useQuery<CommentResponse>({
    queryKey: ["comment"],
    queryFn: async () => {
      const res: CommentResponse = await getAllCommet(); 
      return res; 
    },
  });
};

export const useDeleteComment= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCommentById(id),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['comment'] });
    },
  });
};