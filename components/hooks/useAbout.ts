// hooks/useMember.ts
import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import { About, AboutCreate, AboutRes, AboutResponse } from "../types/about";
import { createAbout, deleteAboutById, getAllAbous, updateAboutById } from "../services/about";
export const useCreateAbout = () => {
  return useMutation({
    mutationFn: (payload: AboutCreate) => createAbout(payload),
    throwOnError: false,   
    retry: false,        
  });
};
export const useGetAllAbout = () => {
  return useQuery<AboutResponse>({
    queryKey: ["aboutget"],
    queryFn: async () => {
      const res: AboutResponse = await getAllAbous(); 
      return res; // return full API response
    },
  });
};

// Update About
export const useUpdateAbout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AboutRes) => updateAboutById(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aboutget'] });
    },
  });
};

// Delete About
export const useDeleteAbout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAboutById(id),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['aboutget'] });
    },
  });
};