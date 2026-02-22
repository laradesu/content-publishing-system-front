// services/member.ts
import { About, AboutCreate, AboutRes, AboutResponse } from "../types/about";
import api from '../lib/axios';

export const createAbout = async (payload?: AboutCreate) => {
  try {
    const response = await api.post("/about/createAbout", payload || {});
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong",
    };
  }
};

export const getAllAbous = async (): Promise<AboutResponse> => {
  const response = await api.get("/about/getAllAbout");
  console.log("about response",response);

  return response?.data;
};

export const updateAboutById = async (id: number, data: AboutRes): Promise<AboutRes> => {
  try {
    console.log("");
    
    const { title, text, icon } = data;
    const payload = {
      title,
      text,
      icon: icon && icon.startsWith('http') ? icon : '', 
    };
    const res = await api.put(`/about/updateAboutById/${id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Update failed:", err.response?.data || err.message);
    throw err;
  }
};


export const deleteAboutById = async (id: number): Promise<void> => {
  await api.delete(`/about/deleteAboutById/${id}`);
};
