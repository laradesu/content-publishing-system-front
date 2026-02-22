
export interface ProgramManagement {
    id: number;
    title: string;
    objectives: string;
    strategies: string;
    main_activities: string[];
    is_active:boolean;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}
export interface ProgramManagementcreate {
    title: string;
    objectives: string;
    strategies: string;
    main_activities: string[];
    is_active:boolean;
}
export interface ProgramManagementResponse {
    success: boolean;
    message: string;
    data: ProgramManagement[];
}