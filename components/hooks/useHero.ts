import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import { Hero, HeroCreate, HeroResponse } from "../types/hero";
import { createHero, deleteHeroById, getAllHero, updateHeroById } from "../services/hero";
export const useCreateHero = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: HeroCreate) => createHero(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero'] }); // REFRESH the list
    },
  });
};

export const useGetAllHero  = () => {
  return useQuery<HeroResponse>({
    queryKey: ["hero"],
    queryFn: async () => {
      const res: HeroResponse = await getAllHero(); 
      return res; 
    },
  });
};

// Update hero
export const useUpdateHero  = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Hero) => updateHeroById(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero'] });
    },
  });
};

// Delete hero
export const useDeleteHero  = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteHeroById(id),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['hero'] });
    },
  });
};