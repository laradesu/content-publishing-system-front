export interface EducationProject {
    id: number;
    title: string;
    description: string;
    is_active:boolean;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}
export interface EducationProjectResponse {
    success: boolean;
    message: string;
    data: EducationProject[];
}
export interface EducationProjectCreate {
    title: string;
    description: string;
    is_active:boolean;
}

export interface HealthProject {
    id: number;
    title: string;
    description: string;
    is_active:boolean;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}
export interface HealthProjectResponse {
    success: boolean;
    message: string;
    data: HealthProject[];
}
export interface HealthProjectCreate {
    title: string;
    description: string;
    is_active:boolean;
}

export interface LivelihoodProject {
    id: number;
    title: string;
    description: string;
    is_active:boolean;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}
export interface LivelihoodProjectResponse {
    success: boolean;
    message: string;
    data: LivelihoodProject[];
}
export interface LivelihoodProjectCreate {
    title: string;
    description: string;
    is_active:boolean;
}