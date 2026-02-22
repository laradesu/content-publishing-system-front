
export interface Company {
    id: number;
    email: string;
    phone: string;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface CompanyCreate {
    email: string;
    phone: string;
    is_active: boolean;
}
export interface CompanyResponse {
    success: boolean;
    message: string;
    data: Company[];
}