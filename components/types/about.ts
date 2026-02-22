export interface AboutCreate {
  title: string;
  text: string;
  icon: string;
}
export interface About {
  id: number;
  title: string;
  text: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}
export interface AboutRes {
  id: number;
  title: string;
  text: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}
export interface AboutResponse {
  success: boolean;
  message: string;
  data: AboutRes[];
}