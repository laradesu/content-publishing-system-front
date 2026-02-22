

import api from '../lib/axios';
import { BoardMember, BoardMemberCreate, GeneralAssemblyCreate, GeneralAssemblyR, GeneralAssemblyResponse, GeneralAssemblyResponse2 } from '../types/generalAssembly';
export const createGeneralAssembly = async (
    payload: GeneralAssemblyCreate
): Promise<GeneralAssemblyResponse2> => {
    try {
        const response = await api.post("/generalassembly/create", payload);
        console.log("res", response.data);
        return response.data;
    } catch (error: any) {
        throw error;
    }
};
export const getAllGeneralAssembly = async () => {
    const response = await api.get("/generalassembly/getGeneralAssemblyForAdmin");
    console.log("source of finance response", response);
    return response?.data;
};
export const updateGeneralAssemblyById = async (id: number, data: GeneralAssemblyR): Promise<GeneralAssemblyResponse2> => {
    try {
        console.log("");
        const { title, sub_title,is_active } = data;
        const payload = {
            title,
            sub_title: sub_title,
            is_active
        };
        const res = await api.put(`/generalassembly/updateGeneralAssemblly/${id}`, payload);
        return res.data;
    } catch (err: any) {
        console.error("Update failed:", err.response?.data || err.message);
        throw err;
    }
};

export const deleteGeneralAssemblyById = async (id: number): Promise<void> => {
    await api.delete(`/generalassembly/deleteGeneralAssembly/${id}`);
};

export const createBoardMember = async (
    payload: BoardMemberCreate
): Promise<GeneralAssemblyResponse> => {
    try {
        const response = await api.post("/generalassembly/board-member/create", payload,{
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log("res", response.data);
        return response.data;
    } catch (error: any) {
        throw error;
    }
};


export const getAllBoardMember = async () => {
    const response = await api.get("/generalassembly/get_all_board-members_actve_and_inactive");
    console.log("source of finance response", response);
    return response?.data;
};
export const fetchMemberTypes  = async () => {
    const response = await api.get("/generalassembly/get-member_types");
    console.log("member types response", response);

    return response?.data;
};
export const updateBoardMemberById = async (id: number, data: BoardMember): Promise<GeneralAssemblyResponse> => {
    try {
        console.log("");
        const { full_name, responsibility, photo, start_date, end_date, is_active, description,member_type,general_assembly_id } = data;
        const payload = {
            full_name,
            photo,
            responsibility,
            description: description,
            start_date: start_date,
            end_date: end_date,
            is_active: is_active,
            member_type: member_type,
            general_assembly_id: general_assembly_id,
        };
        const res = await api.put(`/generalassembly/update_board_member/${id}`, payload,{
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    } catch (err: any) {
        console.error("Update failed:", err.response?.data || err.message);
        throw err;
    }
};


export const deleteBoardMemberById = async (id: number): Promise<void> => {
    await api.delete(`/generalassembly/delete_board_member/${id}`);
};
