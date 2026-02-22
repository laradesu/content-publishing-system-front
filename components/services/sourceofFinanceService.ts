// services/member.ts
import { About, AboutCreate, AboutRes, AboutResponse } from "../types/about";
import api from '../lib/axios';
import { Sourceofcreate, SourceofFinanceResponse } from "../types/source_of_finance";

export const createSourceofFinance = async (
  payload: Sourceofcreate
): Promise<SourceofFinanceResponse> => {
  try {
    const response = await api.post(
      "/sourceoffinance/createSourceofFinance",
      payload
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};


export const getAllSourceofFinance = async (): Promise<SourceofFinanceResponse> => {
  const response = await api.get("/sourceoffinance/getAllSourceOfFinanceForAdmin");
  console.log("source of finance response",response);

  return response?.data;
};

export const updateSourceofFinanceById = async (id: number, data: Sourceofcreate): Promise<SourceofFinanceResponse> => {
  try {
     console.log("req update",data);
    const { title, description,is_active} = data;
    const payload = {
      title,
      description,
      is_active
    };
    const res = await api.put(`/sourceoffinance/updateSourceofFinanceById/${id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Update failed:", err.response?.data || err.message);
    throw err;
  }
};


export const deleteSourceofFinanceById = async (id: number): Promise<void> => {
  await api.delete(`/sourceoffinance/deleteSourceofFinanceById/${id}`);
};
