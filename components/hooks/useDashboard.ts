
import { useQuery } from "@tanstack/react-query";
import { NoofAdminsResponse, NoofMemberssResponse } from "../types/dashboard";
import { getAllNoOfAdmins, getAllNoOfMembers } from "../services/dashboardService";

export const useGetAllNoOfAdmins= () => {
  return useQuery<NoofAdminsResponse>({
    queryKey: ["no-of-admins"],
    queryFn: async () => {
      const res: NoofAdminsResponse = await getAllNoOfAdmins(); 
      return res; 
    },
  });
};
export const useGetAllNoOfMembers= () => {
  return useQuery<NoofMemberssResponse>({
    queryKey: ["no-of-members"],
    queryFn: async () => {
      const res: NoofMemberssResponse = await getAllNoOfMembers(); 
      return res; 
    },
  });
};