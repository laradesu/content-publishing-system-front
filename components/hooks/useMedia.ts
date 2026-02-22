// hooks/useMedia.ts
import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import { createMedia, deleteMediaById, getAllMedia, updateMediaById } from "../services/media";
import { Media, MediaCreate, MediaResponse } from "../types/media";
export const useCreateMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: MediaCreate) => createMedia(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Media'] }); // REFRESH the list
    },
  });
};

export const useGetAllMedia= () => {
  return useQuery<MediaResponse>({
    queryKey: ["Media"],
    queryFn: async () => {
      const res: MediaResponse = await getAllMedia(); 
      return res; 
    },
  });
};

// Update media
export const useUpdateMedia= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Media) => updateMediaById(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Media'] });
    },
  });
};

// Delete media
export const useDeleteMedia= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteMediaById(id),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['Media'] });
    },
  });
};