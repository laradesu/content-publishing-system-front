// hooks/useMember.ts
import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import { createMap, deleteMapById, getAllMaps, updateMapById } from "../services/mapService";
import { Map, MapCreate, MapResponse } from "../types/map";
export const useCreateMap = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: MapCreate) => createMap(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Map'] }); // REFRESH the list
    },
  });
};

export const useGetAllMap= () => {
  return useQuery<MapResponse>({
    queryKey: ["Map"],
    queryFn: async () => {
      const res: MapResponse = await getAllMaps(); 
      return res; 
    },
  });
};

// Update map
export const useUpdateMap= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Map) => updateMapById(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Map'] });
    },
  });
};

// Delete map
export const useDeleteMap= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteMapById(id),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['Map'] });
    },
  });
};