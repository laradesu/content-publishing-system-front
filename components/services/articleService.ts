
import api from '../lib/axios';
import { ArticleCreate, ArticleResponse } from '../types/article';

export const createArticle = async (
  payload: ArticleCreate
): Promise<ArticleResponse> => {
  try {
    const response = await api.post(
      "/article/createArticle",
      payload
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getAllArticle = async (): Promise<ArticleResponse> => {
  const response = await api.get("/article/get_all_articles");
  console.log("source of finance response",response);

  return response?.data;
};

export const updateArticleById = async (id: number, data: ArticleCreate): Promise<ArticleResponse> => {
  try {
    const { title, body,tags,is_published,author_id } = data;
    const payload = {
      title,
      body,
      tags,
      is_published,
      author_id
    };
    const res = await api.put(`/article/update_article/${id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Update failed:", err.response?.data || err.message);
    throw err;
  }
};


export const deleteArticleById = async (id: number): Promise<void> => {
  await api.delete(`/article/delete_article/${id}`);
};
