// hooks/useMember.ts
import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import { Sourceofcreate, SourceofFinance, SourceofFinanceResponse } from "../types/source_of_finance";
import { createSourceofFinance, deleteSourceofFinanceById, getAllSourceofFinance, updateSourceofFinanceById } from "../services/sourceofFinanceService";
export const useCreateSourceofFinance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Sourceofcreate) => createSourceofFinance(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sourceoffinance'] }); // REFRESH the list
    },
  });
};
export const useGetAllSourceofFinance = () => {
  return useQuery<SourceofFinanceResponse>({
    queryKey: ["sourceoffinance"],
    queryFn: async () => {
      const res: SourceofFinanceResponse = await getAllSourceofFinance(); 
      return res; 
    },
  });
};

// Update About
export const useUpdateSourceofFinance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SourceofFinance) => updateSourceofFinanceById(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sourceoffinance'] });
    },
  });
};

// Delete About
export const useDeleteSourceofFinance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteSourceofFinanceById(id),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['sourceoffinance'] });
    },
  });
};