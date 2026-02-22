// hooks/useMember.ts
import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import { LongBrief, LongBriefCreate, LongBriefResponse, Plan, PlanCreate, PlanResponse, Report, ReportCreate, ReportResponse, ShortBrief, ShortBriefCreate, ShortBriefResponse } from "../types/document";
import { createLongBrief, createPlan, createReport, createShortBrief, deleteLongBriefById, deletePlanById, deleteReportById, deleteShortBriefById, getAllLongBrief, getAllPlan, getAllReport, getAllShortBrief, updateLongBriefById, updatePlanById, updateReportById, updateShortBriefById } from "../services/document";
export const useCreateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReportCreate) => createReport(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report'] }); // REFRESH the list
    },
  });
};

export const useGetAllReport= () => {
  return useQuery<ReportResponse>({
    queryKey: ["report"],
    queryFn: async () => {
      const res: ReportResponse = await getAllReport(); 
      return res; 
    },
  });
};

// Update report
export const useUpdateReport= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Report) => updateReportById(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report'] });
    },
  });
};

// Delete report
export const useDeleteReport= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteReportById(id),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['report'] });
    },
  });
};
export const useCreatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PlanCreate) => createPlan(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan'] }); // REFRESH the list
    },
  });
};

export const useGetAllPlan= () => {
  return useQuery<PlanResponse>({
    queryKey: ["report"],
    queryFn: async () => {
      const res: PlanResponse = await getAllPlan(); 
      return res; 
    },
  });
};

// Update plan
export const useUpdatePlan= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Plan) => updatePlanById(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan'] });
    },
  });
};

// Delete plan
export const useDeletePlan= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePlanById(id),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['plan'] });
    },
  });
};
export const useCreateShortBrief = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ShortBriefCreate) => createShortBrief(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shortbrief'] }); // REFRESH the list
    },
  });
};

export const useGetAllShortBrief= () => {
  return useQuery<ShortBriefResponse>({
    queryKey: ["shortbrief"],
    queryFn: async () => {
      const res: ShortBriefResponse = await getAllShortBrief(); 
      return res; 
    },
  });
};

// Update short brief
export const useUpdateShortBrief= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ShortBrief) => updateShortBriefById(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shortbrief'] });
    },
  });
};

// Delete short brief
export const useDeleteShortBrief= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteShortBriefById(id),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['shortbrief'] });
    },
  });
};
export const useCreateLongBrief = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LongBriefCreate) => createLongBrief(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['longbrief'] }); // REFRESH the list
    },
  });
};

export const useGetAllLongBrief= () => {
  return useQuery<LongBriefResponse>({
    queryKey: ["longbrief"],
    queryFn: async () => {
      const res: LongBriefResponse = await getAllLongBrief(); 
      return res; 
    },
  });
};

// Update long brief
export const useUpdateLongBrief= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LongBrief) => updateLongBriefById(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['longbrief'] });
    },
  });
};

// Delete long brief
export const useDeleteLongBrief= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteLongBriefById(id),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['longbrief'] });
    },
  });
};