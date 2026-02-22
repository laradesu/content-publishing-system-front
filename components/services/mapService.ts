
import api from '../lib/axios';
import { MapCreate, MapResponse } from '../types/map';

export const createMap = async (
  payload: MapCreate
): Promise<MapResponse> => {
  try {
    const response = await api.post("/map/createMap", payload);
    console.log("res", response.data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};


export const getAllMaps = async (): Promise<MapResponse> => {
  const response = await api.get("/map/getAllMapsForAdmin");
  console.log("source of map response",response);

  return response?.data;
};

export const updateMapById = async (id: number, data: MapCreate): Promise<MapResponse> => {
  try {
    console.log("");
    const { latitude, longitude,is_active } = data;
    const payload = {
     latitude,
     longitude,
     is_active
    };
    const res = await api.put(`/map/updateMapById/${id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Update failed:", err.response?.data || err.message);
    throw err;
  }
};


export const deleteMapById = async (id: number): Promise<void> => {
  await api.delete(`/map/deleteMapById/${id}`);
};
