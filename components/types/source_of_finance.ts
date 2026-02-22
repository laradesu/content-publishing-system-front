
export interface SourceofFinance {
  id: number;
  title: string;
  description: string;
  is_active:boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
export interface Sourceofcreate {
  title: string;
  description: string;
  is_active:boolean;
}
export interface SourceofFinanceResponse {
  success: boolean;
  message: string;
  data: SourceofFinance[];
}