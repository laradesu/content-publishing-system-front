import api from "../lib/axios";
import { MediaCreate, MediaResponse } from "../types/media";

export const createMedia = async (payload: MediaCreate): Promise<MediaResponse> => {
    try {
        const formData = new FormData();
        formData.append('title', payload.title);
        formData.append('link', payload.link);
        formData.append('is_active', String(payload.is_active));
        if (payload.icon && payload.icon.startsWith('data:')) {
            const res = await fetch(payload.icon);
            const blob = await res.blob();
            formData.append('icon', blob, 'media-icon.png'); // <-- must match backend
        }

        const response = await api.post('/media/createMedia', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return response.data;
    } catch (error: any) {
        throw error;
    }
};


export const getAllMedia = async (): Promise<MediaResponse> => {
    const response = await api.get("/media/getAllMediaForAdmin");
    console.log("media response", response);

    return response?.data;
};

export const updateMediaById = async (id: number, data: MediaCreate): Promise<MediaResponse> => {
    try {
        const formData = new FormData();
        formData.append('title', data.title);
         formData.append('link', data.link);
         formData.append('is_active', String(data.is_active));

        if (data.icon && data.icon.startsWith('data:')) {
            const res = await fetch(data.icon);
            const blob = await res.blob();
            formData.append('icon', blob, 'media-icon.png'); // <-- must match backend
        }

        const res = await api.put(`/media/updateMediaById/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return res.data;
    } catch (err: any) {
        console.error('Update failed:', err.response?.data || err.message);
        throw err;
    }
};



export const deleteMediaById = async (id: number): Promise<void> => {
    await api.delete(`/media/deleteMediaById/${id}`);
};