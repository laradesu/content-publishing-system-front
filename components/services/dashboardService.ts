
import api from '../lib/axios';
import { NoofAccountsResponse, NoofAdminsResponse, NoofBoardResponse, NoofCommentsResponse, NoofMemberssResponse } from '../types/dashboard';
export const getAllNoOfAdmins = async (): Promise<NoofAdminsResponse> => {
  const response = await api.get("/author/getAllNoOfAuthors");
  console.log("no of admins response",response);
  return response?.data;
};
export const getAllNoOfMembers = async (): Promise<NoofMemberssResponse> => {
  const response = await api.get("/article/getAllNoOfArticles");
  console.log("no of members response",response);
  return response?.data;
};