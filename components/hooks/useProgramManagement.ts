// hooks/useMember.ts
import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import { createProgramManagement, deleteProgramManagementById, getAllProgramManagement, updateProgramManagementById } from "../services/programManagement";
import { ProgramManagement, ProgramManagementcreate, ProgramManagementResponse } from "../types/program_managament";

export const useCreateProgramManagement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProgramManagementcreate) => createProgramManagement(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programmanagement'] }); // REFRESH the list
    },
  });
};

export const useGetAllProgramManagement= () => {
  return useQuery<ProgramManagementResponse>({
    queryKey: ["programmanagement"],
    queryFn: async () => {
      const res: ProgramManagementResponse = await getAllProgramManagement(); 
      return res; 
    },
  });
};

// Update membership development
export const useUpdateProgramManagement= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProgramManagement) => updateProgramManagementById(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programmanagement'] });
    },
  });
};

// Delete membership development
export const useDeleteProgramManagement= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProgramManagementById(id),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['programmanagement'] });
    },
  });
};