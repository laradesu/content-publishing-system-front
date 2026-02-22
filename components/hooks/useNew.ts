// hooks/useMember.ts
import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import {  HealthProject, HealthProjectCreate, HealthProjectResponse, LivelihoodProject, LivelihoodProjectCreate, LivelihoodProjectResponse } from "../types/project";
import {  createProjectHealth, createProjectLivelihood, deleteProjectHealthById, deleteProjectLivelihoodById, getAllProjectEducation, getAllProjectProjectHealth, getAllProjectProjectLivelihood, updateProjectEducationById, updateProjectLivelihoodById } from "../services/project";
import { Bids, BidsCreate, BidsResponse, MagazinesCreate, MagazinesResponse, News, NewsCreate, NewsResponse, Vacancies, VacanciesResponse } from "../types/news";
import { createBids, createNews, deleteBidsById, deleteNewsById, deleteVacanciesById, getAllBids, getAllMagazines, getAllNews, getAllVacancies, updateBidsById, updateMagazinesById, updateNewsById, updateVacanciesById } from "../services/news";
export const useCreateNews = () => {
  return useMutation({
    mutationFn: (payload: NewsCreate) => createNews(payload),
    throwOnError: false,   
    retry: false,        
  });
};
export const useGetAllNews  = () => {
  return useQuery<NewsResponse>({
    queryKey: ["news"],
    queryFn: async () => {
      const res: NewsResponse = await getAllNews(); 
      return res; 
    },
  });
};

export const useUpdateNews  = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: News) => updateNewsById(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};

export const useDeleteNews  = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteNewsById(id),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['news'] });
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

export const useCreateBids = () => {
  return useMutation({
    mutationFn: (payload: BidsCreate) => createBids(payload),
    throwOnError: false,   
    retry: false,        
  });
};
export const useGetAllBids  = () => {
  return useQuery<BidsResponse>({
    queryKey: ["bids"],
    queryFn: async () => {
      const res: BidsResponse = await getAllBids(); 
      return res; 
    },
  });
};

export const useUpdateBids  = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Bids) => updateBidsById(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bids'] });
    },
  });
};

export const useDeleteBids  = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteBidsById(id),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['bids'] });
    },
  });
};

export const useCreateMagazines = () => {
  return useMutation({
    mutationFn: (payload: MagazinesCreate) => createBids(payload),
    throwOnError: false,   
    retry: false,        
  });
};
export const useGetAllMagazines  = () => {
  return useQuery<MagazinesResponse>({
    queryKey: ["magazines"],
    queryFn: async () => {
      const res: MagazinesResponse = await getAllMagazines(); 
      return res; 
    },
  });
};

export const useUpdateMagazines  = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Bids) => updateMagazinesById(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['magazine'] });
    },
  });
};

export const useDeleteMagazines  = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteBidsById(id),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['magazines'] });
    },
  });
};
export const useCreateVacancies = () => {
  return useMutation({
    mutationFn: (payload: BidsCreate) => createBids(payload),
    throwOnError: false,   
    retry: false,        
  });
};
export const useGetAllVacancies  = () => {
  return useQuery<VacanciesResponse>({
    queryKey: ["vacancies"],
    queryFn: async () => {
      const res: VacanciesResponse = await getAllVacancies(); 
      return res; 
    },
  });
};

export const useUpdateVacancies  = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Vacancies) => updateVacanciesById(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacancies'] });
    },
  });
};

export const useDeleteVacancies  = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteVacanciesById(id),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['vacancies'] });
    },
  });
};