
import api from '../lib/axios';
import { EducationProjectCreate, EducationProjectResponse, HealthProjectCreate, HealthProjectResponse, LivelihoodProjectCreate, LivelihoodProjectResponse } from '../types/project';

export const createProjectEducation = async (
  payload: EducationProjectCreate
): Promise<EducationProjectResponse> => {
  try {
    const response = await api.post(
      "/educationProject/createEducationProject",
      payload
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};


export const getAllProjectEducation = async (): Promise<EducationProjectResponse> => {
  const response = await api.get("/educationProject/getAllEducationProjectsForAdmin");
  console.log("education response",response);

  return response?.data;
};

export const updateProjectEducationById = async (id: number, data: EducationProjectCreate): Promise<EducationProjectResponse> => {
  try {
    console.log("");
    const { title, description,is_active } = data;
    const payload = {
      title,
      description,
      is_active
    };
    const res = await api.put(`/educationProject/updateEducationProjectById/${id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Update failed:", err.response?.data || err.message);
    throw err;
  }
};


export const deleteProjectEducationById = async (id: number): Promise<void> => {
  await api.delete(`/educationProject/deleteEducationProjectById/${id}`);
};

export const createProjectHealth = async (
  payload: HealthProjectCreate
): Promise<HealthProjectResponse> => {
  try {
    const response = await api.post(
      "/healthProject/createHealthProject",
      payload
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};


export const getAllProjectProjectHealth  = async (): Promise<HealthProjectResponse> => {
  const response = await api.get("/healthProject/getAllHealthProjectsForAdmin");
  console.log("health response",response);

  return response?.data;
};

export const updateProjectHealthById = async (id: number, data: HealthProjectCreate): Promise<HealthProjectResponse> => {
  try {
    console.log("");
    const { title, description,is_active } = data;
    const payload = {
      title,
      description,
      is_active
    };
    const res = await api.put(`/healthProject/updateHealthProjectById/${id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Update failed:", err.response?.data || err.message);
    throw err;
  }
};

export const deleteProjectHealthById = async (id: number): Promise<void> => {
  await api.delete(`/healthProject/deleteHealthProjectById/${id}`);
};
export const createProjectLivelihood = async (
  payload: LivelihoodProjectCreate
): Promise<LivelihoodProjectResponse> => {
  try {
    const response = await api.post(
      "/livelihoodProject/createLivelihoodProject",
      payload
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};


export const getAllProjectProjectLivelihood  = async (): Promise<LivelihoodProjectResponse> => {
  const response = await api.get("/livelihoodProject/getAllLivelihoodProjectsForAdmin");
  console.log("livelihood response",response);

  return response?.data;
};

export const updateProjectLivelihoodById = async (id: number, data: LivelihoodProjectCreate): Promise<LivelihoodProjectResponse> => {
  try {
    console.log("");
    const { title, description,is_active } = data;
    const payload = {
      title,
      description,
      is_active
    };
    const res = await api.put(`/livelihoodProject/updateLivelihoodProjectById/${id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Update failed:", err.response?.data || err.message);
    throw err;
  }
};


export const deleteProjectLivelihoodById = async (id: number): Promise<void> => {
  await api.delete(`/livelihoodProject/deleteLivelihoodProjectById/${id}`);
};