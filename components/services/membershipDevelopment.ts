
import api from '../lib/axios';
import { MembershipDevelopmentcreate, MembershipDevelopmentResponse } from '../types/membership_development';

export const createMembershipDevelopment = async (
  payload: MembershipDevelopmentcreate
): Promise<MembershipDevelopmentResponse> => {
  try {
    const response = await api.post(
      "/membershipDevelopment/createMembershipDevelopmnetProgram",
      payload
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};


export const getAllMembershipDevelopment = async (): Promise<MembershipDevelopmentResponse> => {
  const response = await api.get("/membershipDevelopment/getAllMembershipDevelopmnetProgramForAdmin");
  console.log("source of finance response",response);

  return response?.data;
};

export const updateMembershipDevelopmentById = async (id: number, data: MembershipDevelopmentcreate): Promise<MembershipDevelopmentResponse> => {
  try {
   
    const { title, description,is_active } = data;
    const payload = {
      title,
      description,
      is_active
    };
    const res = await api.put(`/membershipDevelopment/updateMembershipDevelopmnetProgramById/${id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Update failed:", err.response?.data || err.message);
    throw err;
  }
};


export const deleteMembershipDevelopmentById = async (id: number): Promise<void> => {
  await api.delete(`/membershipDevelopment/deleteMembershipDevelopmnetProgramById/${id}`);
};
