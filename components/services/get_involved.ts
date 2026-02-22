
import api from '../lib/axios';
import { Donatecreate, DonateResponse, Membercreate, MemberResponse, Volunetercreate, VoluneterResponse } from '../types/get_involved';

export const createDonate= async (
  payload: Donatecreate
): Promise<DonateResponse> => {
  try {
    const response = await api.post("/donate/createDonate", payload);
    console.log("res", response.data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};


export const getAllDonate = async (): Promise<DonateResponse> => {
  const response = await api.get("/donate/getAllDonateForAdmin");
  console.log("donate response",response);

  return response?.data;
};

export const updateDonateById = async (id: number, data: Donatecreate): Promise<DonateResponse> => {
  try {
    console.log("");
    const { title, accountNumber,swiftCode,is_active} = data;
    const payload = {
     title, 
     accountNumber,
     swiftCode,
     is_active
    }
    const res = await api.put(`/donate/updateDonateById/${id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Update failed:", err.response?.data || err.message);
    throw err;
  }
};


export const deleteDonateById = async (id: number): Promise<void> => {
  await api.delete(`/donate/deleteDonateById/${id}`);
};

export const createMember = async (
  payload: Membercreate
): Promise<MemberResponse> => {
  try {
    const response = await api.post("/member/createMember", payload);
    console.log("res", response.data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};


export const getAllMember = async (): Promise<MemberResponse> => {
  const response = await api.get("/member/getAllMemebrForAdmin");
  console.log("smember response",response);

  return response?.data;
};

export const updateMemberById = async (id: number, data: Membercreate): Promise<MemberResponse> => {
  try {
    console.log("");
    const { title, fullName,email,phoneNumber,username,password,volunteerType,is_active } = data;
    const payload = {
         title, 
         fullName,
         email,
         phoneNumber,
         username,
         password,
         volunteerType,
         is_active
    };
    const res = await api.put(`/member/updateMemberById/${id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Update failed:", err.response?.data || err.message);
    throw err;
  }
};


export const deleteMemberById = async (id: number): Promise<void> => {
  await api.delete(`/member/deleteMemberById/${id}`);
};

export const createVolunteer = async (
  payload: Volunetercreate
): Promise<VoluneterResponse> => {
  try {
    const response = await api.post("/volunteer/createVolunter", payload);
    console.log("res", response.data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};


export const getAllVolunteer = async (): Promise<VoluneterResponse> => {
  const response = await api.get("/volunteer/getAllVolunterForAdmin");
  console.log("volunteer response",response);

  return response?.data;
};

export const updateVolunteerById = async (id: number, data: Volunetercreate): Promise<VoluneterResponse> => {
  try {
    console.log("");
    const { title, fullName,content,description,promised_on,is_active} = data;
    const payload = {
         title, 
         fullName,
         content,
         description,
         promised_on,
         is_active
    };
    const res = await api.put(`/volunteer/updateVolunterById/${id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Update failed:", err.response?.data || err.message);
    throw err;
  }
};


export const deleteVolunteerById = async (id: number): Promise<void> => {
  await api.delete(`/volunteer/deleteVolunterById/${id}`);
};