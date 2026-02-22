// hooks/useMember.ts
import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import { Company, CompanyCreate, CompanyResponse } from "../types/company";
import { createCompany, deleteCompanyById, getAllCompanies, updateCompanyById } from "../services/companyService";
export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CompanyCreate) => createCompany(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Company'] }); // REFRESH the list
    },
  });
};

export const useGetAllCompany= () => {
  return useQuery<CompanyResponse>({
    queryKey: ["Company"],
    queryFn: async () => {
      const res: CompanyResponse = await getAllCompanies(); 
      return res; 
    },
  });
};

// Update company
export const useUpdateCompany= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Company) => updateCompanyById(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Company'] });
    },
  });
};

// Delete company
export const useDeleteCompany= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCompanyById(id),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['Company'] });
    },
  });
};