
import api from '../lib/axios';
import { BidsCreate, BidsResponse, MagazinesCreate, MagazinesResponse, NewsCreate, NewsResponse, VacanciesCreate, VacanciesResponse } from '../types/news';

export const createNews = async (payload: NewsCreate): Promise<NewsResponse> => {
    try {
        const formData = new FormData();
        formData.append('title', payload.title);
        formData.append('content', payload.content);
        formData.append('excerpt', payload.excerpt);

        // Append file only if selected
        if (payload.image_url && payload.image_url.startsWith('data:')) {
            const res = await fetch(payload.image_url);
            const blob = await res.blob();
            formData.append('image_url', blob, 'news-image.png'); // <-- must match backend
        }

        const response = await api.post('/news/createNews', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return response.data;
    } catch (error: any) {
        throw error;
    }
};


export const getAllNews = async (): Promise<NewsResponse> => {
    const response = await api.get("/news/getAllNewsForAdmin");
    console.log("snews response", response);

    return response?.data;
};

export const updateNewsById = async (id: number, data: NewsCreate): Promise<NewsResponse> => {
    try {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('content', data.content);
        formData.append('excerpt', data.excerpt);
        formData.append('is_active', String(data.is_active));
        if (data.image_url && data.image_url.startsWith('data:')) {
            const res = await fetch(data.image_url);
            const blob = await res.blob();
            formData.append('image_url', blob, 'news-image.png'); // <-- must match backend
        }

        const res = await api.patch(`/news/updateNewsById/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return res.data;
    } catch (err: any) {
        console.error('Update failed:', err.response?.data || err.message);
        throw err;
    }
};



export const deleteNewsById = async (id: number): Promise<void> => {
    await api.delete(`/news/deleteNewsById/${id}`);
};

export const createBids = async (payload: BidsCreate): Promise<BidsResponse> => {
    try {
        const formData = new FormData();
        formData.append('title', payload.title);

        if (payload.file) {
            formData.append('file', payload.file); // Only File object
        }

        const response = await api.post('/bids/createBids', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error: any) {
        throw error;
    }
};

export const getAllBids = async (): Promise<BidsResponse> => {
    const response = await api.get("/bids/getAllBidsForAdmin");
    console.log("bids response", response);
    return response?.data;
};
export const updateBidsById = async (id: number, data: BidsCreate): Promise<BidsResponse> => {
    try {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('is_active', String(data.is_active));
        if (data.file) {
            formData.append('file', data.file);
        }
        const res = await api.put(
            `/bids/updateBidsById/${id}`,
            formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }
        );
        return res.data;

    } catch (err: any) {
        console.error('Update failed:', err.response?.data || err.message);
        throw err;
    }
};
export const deleteBidsById = async (id: number): Promise<void> => {
    await api.delete(`/bids/deleteBidsById/${id}`);
};




export const createMagazines = async (payload: MagazinesCreate): Promise<MagazinesResponse> => {
    try {
        const formData = new FormData();
        formData.append('title', payload.title);

        if (payload.file) {
            formData.append('file', payload.file); // Only File object
        }

        const response = await api.post('/magazines/createMagazines', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error: any) {
        throw error;
    }
};

export const getAllMagazines = async (): Promise<MagazinesResponse> => {
    const response = await api.get("/magazines/getAllMagazinesForAdmin");
    console.log("bids response", response);
    return response?.data;
};
export const updateMagazinesById = async (id: number, data: MagazinesCreate): Promise<MagazinesResponse> => {
    try {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('is_active', String(data.is_active));
        if (data.file) {
            formData.append('file', data.file);
        }
        const res = await api.put(
            `/magazines/updateMagazineById/${id}`,
            formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }
        );
        return res.data;

    } catch (err: any) {
        console.error('Update failed:', err.response?.data || err.message);
        throw err;
    }
};
export const deleteMagazinesById = async (id: number): Promise<void> => {
    await api.delete(`/magazines/deleteMagazinesById/${id}`);
};


export const createVacancies = async (payload: VacanciesCreate): Promise<VacanciesResponse> => {
    try {
        const formData = new FormData();
        formData.append('title', payload.title);

        if (payload.file) {
            formData.append('file', payload.file); // Only File object
        }

        const response = await api.post('/vacancy/createVacancy', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error: any) {
        throw error;
    }
};

export const getAllVacancies = async (): Promise<VacanciesResponse> => {
    const response = await api.get("/vacancy/getAllVacancyForAdmin");
    console.log("vacancy response", response);
    return response?.data;
};
export const updateVacanciesById = async (id: number, data: VacanciesCreate): Promise<VacanciesResponse> => {
    try {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('is_active', String(data.is_active));
        if (data.file) {
            formData.append('file', data.file);
        }
        const res = await api.put(
            `/vacancy/updateVacancyById/${id}`,
            formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }
        );
        return res.data;

    } catch (err: any) {
        console.error('Update failed:', err.response?.data || err.message);
        throw err;
    }
};
export const deleteVacanciesById = async (id: number): Promise<void> => {
    await api.delete(`/vacancy/deleteVacancyById/${id}`);
};