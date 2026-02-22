
import api from '../lib/axios';
import { ProgramManagementcreate, ProgramManagementResponse } from '../types/program_managament';

export const createProgramManagement = async (
  payload: ProgramManagementcreate
): Promise<ProgramManagementResponse> => {
  try {
    const response = await api.post(
      "/programManagement/createProgram",
      payload
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};


export const getAllProgramManagement = async (): Promise<ProgramManagementResponse> => {
  const response = await api.get("/programManagement/getAllProgramForAdmin");
  console.log("source of finance response",response);

  return response?.data;
};

export const updateProgramManagementById = async (id: number, data: ProgramManagementcreate): Promise<ProgramManagementResponse> => {
  try {
    const { title, objectives,strategies,main_activities,is_active } = data;
    const payload = {
      title,
      objectives,
      strategies,
      main_activities,
      is_active
    };
    const res = await api.put(`/programManagement/updateProgramById/${id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Update failed:", err.response?.data || err.message);
    throw err;
  }
};


export const deleteProgramManagementById = async (id: number): Promise<void> => {
  await api.delete(`/programManagement/deleteProgramById/${id}`);
};
