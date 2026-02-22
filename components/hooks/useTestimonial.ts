// hooks/useMember.ts
import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import { createTestimonial, deleteTestimonialById, getAllTestimonial, updateTestimonialById } from "../services/testimonial";
import { Testimonial, TestimonialCreate, TestimonialResponse } from "../types/testimonial";
export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TestimonialCreate) => createTestimonial(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tetimonial'] }); // REFRESH the list
    },
  });
};

export const useGetAllTestimonial= () => {
  return useQuery<TestimonialResponse>({
    queryKey: ["tetimonial"],
    queryFn: async () => {
      const res: TestimonialResponse = await getAllTestimonial(); 
      return res; 
    },
  });
};

// Update testimonial
export const useUpdateTestimonial= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Testimonial) => updateTestimonialById(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonial'] });
    },
  });
};

// Delete testimonial
export const useDeleteTestimonial= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTestimonialById(id),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['testimonial'] });
    },
  });
};