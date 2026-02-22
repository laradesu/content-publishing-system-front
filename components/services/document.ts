
import api from '../lib/axios';
import { LongBriefCreate, LongBriefResponse, PlanCreate, PlanResponse, ReportCreate, ReportResponse, ShortBriefCreate, ShortBriefResponse } from '../types/document';
import { BidsCreate, BidsResponse, MagazinesCreate, MagazinesResponse, NewsCreate, NewsResponse, VacanciesCreate, VacanciesResponse } from '../types/news';

export const createReport = async (payload: ReportCreate): Promise<ReportResponse> => {
    try {
        const formData = new FormData();
        formData.append('title', payload.title);
        formData.append('content', payload.content);
        formData.append('is_active', String(payload.is_active));
        if (payload.file) {
            formData.append('file', payload.file); // Only File object
        }

        const response = await api.post('/report/createReport', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error: any) {
        throw error;
    }
};


export const getAllReport = async (): Promise<ReportResponse> => {
    const response = await api.get("/report/getAllReportsForAdmin");
    console.log("report response", response);

    return response?.data;
};

export const updateReportById = async (id: number, data: ReportCreate): Promise<ReportResponse> => {
    try {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('content', data.content);
        formData.append('is_active', String(data.is_active));
        if (data.file) {
            formData.append('file', data.file); // Only File object
        }
        const res = await api.put(`/report/updateReportById/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    } catch (err: any) {
        console.error('Update failed:', err.response?.data || err.message);
        throw err;
    }
};

export const deleteReportById = async (id: number): Promise<void> => {
    await api.delete(`/report/deleteReportById/${id}`);
};
export const createPlan = async (payload: PlanCreate): Promise<PlanResponse> => {
    try {
        const formData = new FormData();
        formData.append('title', payload.title);
        formData.append('content', payload.content);
        formData.append('is_active', String(payload.is_active));
        if (payload.file) {
            formData.append('file', payload.file); // Only File object
        }
        const response = await api.post('/plan/creatPlan', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error: any) {
        throw error;
    }
};

export const getAllPlan = async (): Promise<PlanResponse> => {
    const response = await api.get("/plan/getAllPlanForAdmin");
    console.log("plan response", response);
    return response?.data;
};
export const updatePlanById = async (id: number, data: PlanCreate): Promise<PlanResponse> => {
    try {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('content', data.content);
        formData.append('is_active', String(data.is_active));
        if (data.file) {
            formData.append('file', data.file);
        }
        const res = await api.put(
            `/plan/updatePlanById/${id}`,
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
export const deletePlanById = async (id: number): Promise<void> => {
    await api.delete(`/plan/deletePlanById/${id}`);
};

export const createShortBrief = async (payload: ShortBriefCreate): Promise<ShortBriefResponse> => {
    try {
        const formData = new FormData();
        formData.append('title', payload.title);
        formData.append('content', payload.content);
        formData.append('is_active', String(payload.is_active));
        if (payload.file) {
            formData.append('file', payload.file); // Only File object
        }
        const response = await api.post('/shortbrief/createShortBrief', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error: any) {
        throw error;
    }
};

export const getAllShortBrief = async (): Promise<ShortBriefResponse> => {
    const response = await api.get("/shortbrief/getAllShortBriefsForAdmin");
    console.log("bids response", response);
    return response?.data;
};
export const updateShortBriefById = async (id: number, data: ShortBriefCreate): Promise<ShortBriefResponse> => {
    try {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('content', data.content);
        formData.append('is_active', String(data.is_active));
        if (data.file) {
            formData.append('file', data.file);
        }
        const res = await api.put(
            `/shortbrief/updateShortBriefById/${id}`,
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
export const deleteShortBriefById = async (id: number): Promise<void> => {
    await api.delete(`/shortbrief/deleteShortBriefById/${id}`);
};


export const createLongBrief = async (payload: LongBriefCreate): Promise<LongBriefResponse> => {
    try {
        const formData = new FormData();
        formData.append('title', payload.title);
        formData.append('content', payload.content);
        formData.append('is_active', String(payload.is_active));
        if (payload.file) {
            formData.append('file', payload.file); // Only File object
        }

        const response = await api.post('/longbrief/createLongBrief', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error: any) {
        throw error;
    }
};

export const getAllLongBrief = async (): Promise<LongBriefResponse> => {
    const response = await api.get("/longbrief/getAllLongBriefsForAdmin");
    console.log("long brief response", response);
    return response?.data;
};
export const updateLongBriefById = async (id: number, data: LongBriefCreate): Promise<LongBriefResponse> => {
    try {
        const formData = new FormData();
        formData.append('title', data.title);
         formData.append('content', data.content);
        formData.append('is_active', String(data.is_active));
        if (data.file) {
            formData.append('file', data.file);
        }
        const res = await api.put(
            `/longbrief/updateLongBriefById/${id}`,
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
export const deleteLongBriefById = async (id: number): Promise<void> => {
    await api.delete(`/longbrief/deleteLongBriefById/${id}`);
};