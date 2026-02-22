
import api from '../lib/axios';
import { CommentResponse } from '../types/comment';
export const getAllCommet = async (): Promise<CommentResponse> => {
  const response = await api.get("/comment/getAllCommentsForAdmin");
  console.log("source of comment response",response);

  return response?.data;
};
export const deleteCommentById = async (id: number): Promise<void> => {
  await api.delete(`/comment/deleteCommentById/${id}`);
};
