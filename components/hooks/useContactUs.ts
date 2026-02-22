// hooks/useMember.ts
import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import { createContactUs, deleteContactUsById, getAllContactUs, updateContactUsById } from "../services/contactUs";
import { ContactUs, ContactUscreate, ContactUsResponse } from "../types/contact_us";
export const useCreateContactUs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ContactUscreate) => createContactUs(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ContactUs'] }); // REFRESH the list
    },
  });
};

export const useGetAllContactUs= () => {
  return useQuery<ContactUsResponse>({
    queryKey: ["ContactUs"],
    queryFn: async () => {
      const res: ContactUsResponse = await getAllContactUs(); 
      return res; 
    },
  });
};

// Update membership development
export const useUpdateContactUs= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ContactUs) => updateContactUsById(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ContactUs'] });
    },
  });
};

// Delete membership development
export const useDeleteContactUs= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteContactUsById(id),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['ContactUs'] });
    },
  });
};