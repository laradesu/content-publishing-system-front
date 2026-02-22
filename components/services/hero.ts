import api from "../lib/axios";
import { HeroCreate, HeroResponse } from "../types/hero";

export const createHero = async (payload: HeroCreate): Promise<HeroResponse> => {
    try {
        const formData = new FormData();
        formData.append('is_active', String(payload.is_active));
        if (payload.image && payload.image.startsWith('data:')) {
            const res = await fetch(payload.image);
            const blob = await res.blob();
            formData.append('image', blob, 'image.png'); // <-- must match backend
        }

        const response = await api.post('/hero/createHero', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return response.data;
    } catch (error: any) {
        throw error;
    }
};


export const getAllHero = async (): Promise<HeroResponse> => {
    const response = await api.get("/hero/getAllHeroForAdmin");
    console.log("photo response", response);

    return response?.data;
};

export const updateHeroById = async (id: number, data: HeroCreate): Promise<HeroResponse> => {
    try {
        const formData = new FormData();
        formData.append('is_active', String(data.is_active));
        if (data.image && data.image.startsWith('data:')) {
            const res = await fetch(data.image);
            const blob = await res.blob();
            formData.append('image', blob, 'image.png'); // <-- must match backend
        }

        const res = await api.patch(`/hero/updateHeroById/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return res.data;
    } catch (err: any) {
        console.error('Update failed:', err.response?.data || err.message);
        throw err;
    }
};



export const deleteHeroById = async (id: number): Promise<void> => {
    await api.delete(`/hero/deleteHeroById/${id}`);
};