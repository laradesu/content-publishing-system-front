import api from "../lib/axios";
import { PhotoCreate, PhotoResponse, VideoCreate, VideoResponse } from "../types/gallery";

export const createPhoto = async (payload: PhotoCreate): Promise<PhotoResponse> => {
    try {
        const formData = new FormData();
        formData.append('title', payload.title);
        formData.append('is_active', String(payload.is_active));
        if (payload.image && payload.image.startsWith('data:')) {
            const res = await fetch(payload.image);
            const blob = await res.blob();
            formData.append('image', blob, 'photo-image.png'); // <-- must match backend
        }

        const response = await api.post('/photo/createPhoto', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return response.data;
    } catch (error: any) {
        throw error;
    }
};


export const getAllPhoto = async (): Promise<PhotoResponse> => {
    const response = await api.get("/photo/getAllPhotoForAdmin");
    console.log("photo response", response);

    return response?.data;
};

export const updatePhotoById = async (id: number, data: PhotoCreate): Promise<PhotoResponse> => {
    try {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('is_active', String(data.is_active));
        if (data.image && data.image.startsWith('data:')) {
            const res = await fetch(data.image);
            const blob = await res.blob();
            formData.append('image', blob, 'photo-image.png'); // <-- must match backend
        }

        const res = await api.put(`/photo/updatePhotoById/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return res.data;
    } catch (err: any) {
        console.error('Update failed:', err.response?.data || err.message);
        throw err;
    }
};



export const deletePhotoById = async (id: number): Promise<void> => {
    await api.delete(`/photo/deletePhotoById/${id}`);
};

export const createVideo = async (payload: VideoCreate): Promise<VideoResponse> => {
    try {
        const formData = new FormData();
        formData.append('title', payload.title);
        formData.append('is_active', String(payload.is_active));
        // Append file only if selected
        if (payload.video && payload.video.startsWith('data:')) {
            const res = await fetch(payload.video);
            const blob = await res.blob();
            formData.append('video', blob, 'video.mp4'); // <-- must match backend
        }

        const response = await api.post('/video/createVideo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return response.data;
    } catch (error: any) {
        throw error;
    }
};


export const getAllVideo  = async (): Promise<VideoResponse> => {
    const response = await api.get("/video/getAllVideoForAdmin");
    console.log("video response", response);

    return response?.data;
};

export const updateVideoById = async (id: number, data: VideoCreate): Promise<VideoResponse> => {
    try {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('is_active', String(data.is_active));
        if (data.video && data.video.startsWith('data:')) {
            const res = await fetch(data.video);
            const blob = await res.blob();
            formData.append('video', blob, 'video.mp4'); // <-- must match backend
        }

        const res = await api.put(`/video/updateVideoById/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return res.data;
    } catch (err: any) {
        console.error('Update failed:', err.response?.data || err.message);
        throw err;
    }
};



export const deleteVideoById = async (id: number): Promise<void> => {
    await api.delete(`/video/deleteVideoById/${id}`);
};