import api from "../lib/axios";
import { TestimonialCreate, TestimonialResponse } from "../types/testimonial";

export const createTestimonial = async (payload: TestimonialCreate): Promise<TestimonialResponse> => {
    try {
        const formData = new FormData();
        formData.append('clientName', payload.clientName);
        formData.append('review', payload.review);
        formData.append('post', payload.post);
        formData.append('is_active', String(payload.is_active));
        if (payload.clientImg && payload.clientImg.startsWith('data:')) {
            const res = await fetch(payload.clientImg);
            const blob = await res.blob();
            formData.append('clientImg', blob, 'image.png'); // <-- must match backend
        }

        const response = await api.post('/testimonials/createTestimonal', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return response.data;
    } catch (error: any) {
        throw error;
    }
};


export const getAllTestimonial = async (): Promise<TestimonialResponse> => {
    const response = await api.get("/testimonials/getAllTestimonialsForAdmin");
    console.log("photo response", response);

    return response?.data;
};

export const updateTestimonialById = async (id: number, data: TestimonialCreate): Promise<TestimonialResponse> => {
    try {
        const formData = new FormData();
        formData.append('clientName', data.clientName);
        formData.append('review', data.review);
        formData.append('post', data.post);
        formData.append('is_active', String(data.is_active));
        if (data.clientImg && data.clientImg.startsWith('data:')) {
            const res = await fetch(data.clientImg);
            const blob = await res.blob();
            formData.append('clientImg', blob, 'image.png'); // <-- must match backend
        }

        const res = await api.patch(`/testimonials/updateTestimonialsById/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return res.data;
    } catch (err: any) {
        console.error('Update failed:', err.response?.data || err.message);
        throw err;
    }
};



export const deleteTestimonialById = async (id: number): Promise<void> => {
    await api.delete(`/testimonials/deleteTestimonialsById/${id}`);
};