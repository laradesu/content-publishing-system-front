// hooks/useMember.ts
import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import { EducationProject, EducationProjectCreate, EducationProjectResponse, HealthProject, HealthProjectCreate, HealthProjectResponse, LivelihoodProject, LivelihoodProjectCreate, LivelihoodProjectResponse } from "../types/project";
import { createProjectEducation, createProjectHealth, createProjectLivelihood, deleteProjectHealthById, deleteProjectLivelihoodById, getAllProjectEducation, getAllProjectProjectHealth, getAllProjectProjectLivelihood, updateProjectEducationById, updateProjectLivelihoodById } from "../services/project";
export const useCreateProjectEducation = () => {
  return useMutation({
    mutationFn: (payload: EducationProjectCreate) => createProjectEducation(payload),
    throwOnError: false,   
    retry: false,        
  });
};
export const useGetAllProjectEducation = () => {
  return useQuery<EducationProjectResponse>({
    queryKey: ["projecteducation"],
    queryFn: async () => {
      const res: EducationProjectResponse = await getAllProjectEducation(); 
      return res; 
    },
  });
};

export const useUpdateProjectEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EducationProject) => updateProjectEducationById(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projecteducation'] });
    },
  });
};

export const useDeleteProjectEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProjectHealthById(id),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['projecteducation'] });
    },
  });
};

export const useCreateProjectHealth = () => {
  return useMutation({
    mutationFn: (payload: HealthProjectCreate) => createProjectHealth(payload),
    throwOnError: false,   
    retry: false,        
  });
};
export const useGetAllProjectHealth  = () => {
  return useQuery<HealthProjectResponse>({
    queryKey: ["projecthealth"],
    queryFn: async () => {
      const res: HealthProjectResponse = await getAllProjectProjectHealth(); 
      return res; 
    },
  });
};

export const useUpdateProjectHealth  = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: HealthProject) => updateProjectEducationById(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projecthealth'] });
    },
  });
};

export const useDeleteProjectHealth  = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProjectHealthById(id),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['projecthealth'] });
    },
  });
};

export const useCreateProjectLivelihood = () => {
  return useMutation({
    mutationFn: (payload: LivelihoodProjectCreate) => createProjectLivelihood(payload),
    throwOnError: false,   
    retry: false,        
  });
};
export const useGetAllProjectLivelihood  = () => {
  return useQuery<LivelihoodProjectResponse>({
    queryKey: ["projectlivelihood"],
    queryFn: async () => {
      const res: LivelihoodProjectResponse = await getAllProjectProjectLivelihood(); 
      return res; 
    },
  });
};

export const useUpdateProjectLivelihood  = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LivelihoodProject) => updateProjectLivelihoodById(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectlivelihood'] });
    },
  });
};

export const useDeleteProjectLivelihood  = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProjectLivelihoodById(id),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['projectlivelihood'] });
    },
  });
};