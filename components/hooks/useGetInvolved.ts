// hooks/useMember.ts
import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import { Donate, Donatecreate, DonateResponse, Member, Membercreate, MemberResponse, Voluneter, Volunetercreate, VoluneterResponse } from "../types/get_involved";
import { createDonate, createMember, createVolunteer, deleteDonateById, deleteMemberById, deleteVolunteerById, getAllDonate, getAllMember, getAllVolunteer, updateDonateById, updateMemberById, updateVolunteerById } from "../services/get_involved";

export const useCreateDonate= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Donatecreate) => createDonate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donate'] }); // REFRESH the list
    },
  });
};

export const useGetAllDonate= () => {
  return useQuery<DonateResponse>({
    queryKey: ["donate"],
    queryFn: async () => {
      const res: DonateResponse = await getAllDonate(); 
      return res; 
    },
  });
};

// Update donate
export const useUpdateDonate= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Donate) => updateDonateById(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donate'] });
    },
  });
};

// Delete donate
export const useDeleteDonate= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteDonateById(id),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['donate'] });
    },
  });
};

export const useCreateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Membercreate) => createMember(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member'] }); // REFRESH the list
    },
  });
};

export const useGetAllMember= () => {
  return useQuery<MemberResponse>({
    queryKey: ["member"],
    queryFn: async () => {
      const res: MemberResponse = await getAllMember(); 
      return res; 
    },
  });
};

// Update member
export const useUpdateMember= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Member) => updateMemberById(data.id, data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member'] });
    },
  });
};

// Delete member
export const useDeleteMember= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteMemberById(id),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['member'] });
    },
  });
};

export const useCreateVolunteer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Volunetercreate) => createVolunteer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteer'] }); // REFRESH the list
    },
  });
};

export const useGetAllVolunteer= () => {
  return useQuery<VoluneterResponse>({
    queryKey: ["volunteer"],
    queryFn: async () => {
      const res: VoluneterResponse = await getAllVolunteer(); 
      return res; 
    },
  });
};

// Update volunteer
export const useUpdateVolunteer= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Voluneter) => updateVolunteerById(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteer'] });
    },
  });
};

// Delete volunteer
export const useDeleteVolunteer= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteVolunteerById(id),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['volunteer'] });
    },
  });
};