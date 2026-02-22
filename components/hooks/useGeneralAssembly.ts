// hooks/useMember.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BoardMember, BoardMemberCreate, GeneralAssemblyCreate, GeneralAssemblyR, GeneralAssemblyResponse } from "../types/generalAssembly";
import { createBoardMember, createGeneralAssembly, deleteBoardMemberById, deleteGeneralAssemblyById, fetchMemberTypes, getAllBoardMember, getAllGeneralAssembly, updateBoardMemberById, updateGeneralAssemblyById } from "../services/general_assembly";
export const useCreateGeneralAssembly = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: GeneralAssemblyCreate) => createGeneralAssembly(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['generalassembly'] }); // REFRESH the list
        },
    });
};

export const useGetAllGeneralAssembly = () => {
    return useQuery<GeneralAssemblyResponse>({
        queryKey: ["generalassembly"],
        queryFn: async () => {
            const res: GeneralAssemblyResponse = await getAllGeneralAssembly();
            return res;
        },
    });
};


// Update general assembly
export const useUpdateGeneralAssembly = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: GeneralAssemblyR) => updateGeneralAssemblyById(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['generalassembly'] });
        },
    });
};

// Delete boradmember
export const useDeleteGeneralAssembly = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteGeneralAssemblyById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['generalassembly'] });
        },
    });
};

export const useCreateBoardMember = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: BoardMemberCreate) => createBoardMember(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['boardmember'] }); // REFRESH the list
        },
    });
};

export const useGetAllBoardMember = () => {
    return useQuery<GeneralAssemblyResponse>({
        queryKey: ["boardmember"],
        queryFn: async () => {
            const res: GeneralAssemblyResponse = await getAllBoardMember();
            return res;
        },
    });
};


// Update boradmember
export const useUpdateBoardMember = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: BoardMember) => updateBoardMemberById(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['boardmember'] });
        },
    });
};

// Delete boradmember
export const useDeleteBoardMember = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteBoardMemberById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['boradmember'] });
        },
    });
};

export const useGetMemberTypes = () => {
    return useQuery({
        queryKey: ['member-types'],
        queryFn: fetchMemberTypes,
    });
};