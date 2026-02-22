
export interface MembershipDevelopment {
  id: number;
  title: string;
  description: string;
  is_active:boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
export interface MembershipDevelopmentcreate {
  title: string;
  description: string;
  is_active:boolean;
}
export interface MembershipDevelopmentResponse {
  success: boolean;
  message: string;
  data: MembershipDevelopment[];
}