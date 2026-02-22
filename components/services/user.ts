import api from "../lib/axios";
import { GetUserByIdResponse, UserCreate, UserLoginCreate, UserLoginResponse, UserResponse } from "../types/user";

export const createUser = async (payload: UserCreate): Promise<UserResponse> => {
    try {
        const response = await api.post('/register/createRegister',payload);
        return response.data;
    } catch (error: any) {
        throw error;
    }
};

export const getAllUser = async (): Promise<UserResponse> => {
    const response = await api.get("/register/getAllRegisterForAdmin");
    console.log("photo response", response);

    return response?.data;
};
export const getUserById = async (id: number): Promise<GetUserByIdResponse> => {
  const response = await api.get(`/register/getRegisterById/${id}`);
  return response.data;
};
export const updateUserById = async (id: number, data: UserCreate): Promise<UserResponse> => {
    try {
    const { title, fullName,email,phoneNumber,username,password,is_active} = data;
    const payload = {
        title,
         fullName,
         email,
         phoneNumber,
         username,
         password,
         is_active
    };
        const res = await api.put(`/register/updateRegisterById/${id}`,payload);
        return res.data;
    } catch (err: any) {
        console.error('Update failed:', err.response?.data || err.message);
        throw err;
    }
};
export const deleteUserById = async (id: number): Promise<void> => {
    await api.delete(`/register/deleteRegisterById/${id}`);
};

export const UserLogin = async (payload: UserLoginCreate): Promise<UserLoginResponse> => {
    try {
        console.log("request",payload);
        
        const response = await api.post('/auth/login',payload);
        console.log("response",response);
        return response.data;
    } catch (error: any) {
        throw error;
    }
};