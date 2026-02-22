export interface Report {
    id: number;
    title: string;
    file: string | File | null;
    content: string;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ReportResponse {
    success: boolean;
    message: string;
    data: Report[];
}
export interface ReportCreate {
    title: string;
    file: string | File | null;
    content: string;
    is_active: boolean;
}

export interface Plan {
    id: number;
    title: string;
    file: string | File | null;
    content: string;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface PlanResponse {
    success: boolean;
    message: string;
    data: Plan[];
}
export interface PlanCreate {
    title: string;
    file: string | File | null;
    content: string;
    is_active: boolean;
}

export interface ShortBrief {
    id: number;
    title: string;
    file: string | File | null;
    content: string;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ShortBriefResponse {
    success: boolean;
    message: string;
    data: ShortBrief[];
}
export interface ShortBriefCreate {
    title: string;
    file: string | File | null;
    content: string;
    is_active: boolean;
}

export interface LongBrief {
    id: number;
    title: string;
    file: string | File | null;
    content: string;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface LongBriefResponse {
    success: boolean;
    message: string;
    data: LongBrief[];
}
export interface LongBriefCreate {
    title: string;
    file: string | File | null;
    content: string;
    is_active: boolean;
}