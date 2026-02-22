// hooks/useMember.ts
import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import { MembershipDevelopment, MembershipDevelopmentcreate, MembershipDevelopmentResponse } from "../types/membership_development";
import { createMembershipDevelopment, deleteMembershipDevelopmentById, getAllMembershipDevelopment, updateMembershipDevelopmentById } from "../services/membershipDevelopment";

export const useCreateMembershipDevelopment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: MembershipDevelopmentcreate) => createMembershipDevelopment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membershipdevelopment'] }); // REFRESH the list
    },
  });
};
export const useGetAllMembershipDevelopment = () => {
  return useQuery<MembershipDevelopmentResponse>({
    queryKey: ["membershipdevelopment"],
    queryFn: async () => {
      const res: MembershipDevelopmentResponse = await getAllMembershipDevelopment(); 
      return res; 
    },
  });
};

// Update membershipdevelopment
export const useUpdateMembershipDevelopment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MembershipDevelopment) => updateMembershipDevelopmentById(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membershipdevelopment'] });
    },
  });
};

// Delete membershipdevelopment
export const useDeleteMembershipDevelopment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteMembershipDevelopmentById(id),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['membershipdevelopment'] });
    },
  });
};