
import api from '../lib/axios';
import { NoofAccountsResponse, NoofAdminsResponse, NoofBoardResponse, NoofCommentsResponse, NoofMemberssResponse } from '../types/dashboard';
export const getAllNoOfAdmins = async (): Promise<NoofAdminsResponse> => {
  const response = await api.get("/dashboard/getAllNoOfAdmins");
  console.log("no of admins response",response);
  return response?.data;
};
export const getAllNoOfComments = async (): Promise<NoofCommentsResponse> => {
  const response = await api.get("/dashboard/getAllNoOfComments");
  console.log("no of comments response",response);
  return response?.data;
};
export const getAllNoOfMembers = async (): Promise<NoofMemberssResponse> => {
  const response = await api.get("/dashboard/getAllNoOfMembers");
  console.log("no of members response",response);
  return response?.data;
};
export const getAllNoOfAccounts = async (): Promise<NoofAccountsResponse> => {
  const response = await api.get("/dashboard/getAllNoOfAccounts");
  console.log("no of accounts response",response);
  return response?.data;
};
export const getAllNoOfBoard = async (): Promise<NoofBoardResponse> => {
  const response = await api.get("/dashboard/getAllNoOfBoardMembers");
  console.log("no of board response",response);
  return response?.data;
};