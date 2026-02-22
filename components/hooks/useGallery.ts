// hooks/useMember.ts
import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import { Photo, PhotoCreate, PhotoResponse, Video, VideoCreate, VideoResponse } from "../types/gallery";
import { createPhoto, createVideo, deletePhotoById, deleteVideoById, getAllPhoto, getAllVideo, updatePhotoById, updateVideoById } from "../services/gallery";
export const useCreatePhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PhotoCreate) => createPhoto(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Photo'] }); // REFRESH the list
    },
  });
};

export const useGetAllPhoto= () => {
  return useQuery<PhotoResponse>({
    queryKey: ["Photo"],
    queryFn: async () => {
      const res: PhotoResponse = await getAllPhoto(); 
      return res; 
    },
  });
};

// Update photo
export const useUpdatePhoto= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Photo) => updatePhotoById(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Photo'] });
    },
  });
};

// Delete photo
export const useDeletePhoto= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePhotoById(id),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['Photo'] });
    },
  });
};
export const useCreateVideo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: VideoCreate) => createVideo(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Video'] }); // REFRESH the list
    },
  });
};

export const useGetAllVideo= () => {
  return useQuery<VideoResponse>({
    queryKey: ["Video"],
    queryFn: async () => {
      const res: VideoResponse = await getAllVideo(); 
      return res; 
    },
  });
};

// Update video
export const useUpdateVideo= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Video) => updateVideoById(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Video'] });
    },
  });
};

// Delete video
export const useDeleteVideo= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteVideoById(id),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['Video'] });
    },
  });
};