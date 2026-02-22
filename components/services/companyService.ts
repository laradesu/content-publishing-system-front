
import api from '../lib/axios';
import { CompanyCreate, CompanyResponse } from '../types/company';

export const createCompany = async (
  payload: CompanyCreate
): Promise<CompanyResponse> => {
  try {
    const response = await api.post("/company/createCompany", payload);
    console.log("res", response.data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};


export const getAllCompanies = async (): Promise<CompanyResponse> => {
  const response = await api.get("/company/getAllCompaniesForAdmin");
  console.log("source of company response",response);

  return response?.data;
};

export const updateCompanyById = async (id: number, data: CompanyCreate): Promise<CompanyResponse> => {
  try {
    console.log("");
    const { email, phone,is_active } = data;
    const payload = {
     email,
     phone,
     is_active
    };
    const res = await api.put(`/company/updateCompanyById/${id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Update failed:", err.response?.data || err.message);
    throw err;
  }
};


export const deleteCompanyById = async (id: number): Promise<void> => {
  await api.delete(`/company/deleteCompanyById/${id}`);
};
