
import { useQuery } from "@tanstack/react-query";
import { NoofAccountsResponse, NoofAdminsResponse, NoofBoardResponse, NoofCommentsResponse, NoofMemberssResponse } from "../types/dashboard";
import { getAllNoOfAccounts, getAllNoOfAdmins, getAllNoOfBoard, getAllNoOfComments, getAllNoOfMembers } from "../services/dashboardService";

export const useGetAllNoOfAdmins= () => {
  return useQuery<NoofAdminsResponse>({
    queryKey: ["no-of-admins"],
    queryFn: async () => {
      const res: NoofAdminsResponse = await getAllNoOfAdmins(); 
      return res; 
    },
  });
};
export const useGetAllNoOfComments= () => {
  return useQuery<NoofCommentsResponse>({
    queryKey: ["no-of-comments"],
    queryFn: async () => {
      const res: NoofCommentsResponse = await getAllNoOfComments(); 
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
export const useGetAllNoOfAccounts= () => {
  return useQuery<NoofAccountsResponse>({
    queryKey: ["no-of-accounts"],
    queryFn: async () => {
      const res: NoofAccountsResponse = await getAllNoOfAccounts(); 
      return res; 
    },
  });
};
export const useGetAllNoOfBoard= () => {
  return useQuery<NoofBoardResponse>({
    queryKey: ["no-of-board"],
    queryFn: async () => {
      const res: NoofBoardResponse = await getAllNoOfBoard(); 
      return res; 
    },
  });
};