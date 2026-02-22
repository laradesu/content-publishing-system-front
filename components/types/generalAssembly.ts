export interface BoardMember {
    id: number;
    full_name: string;
    responsibility: string;
    photo: string | File;
    description: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    member_type: string;
    general_assembly_id: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface BoardMemberCreate {
    full_name: string;
    responsibility: string;
    photo: string | File;
    description: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    member_type: string;
    general_assembly_id: number;
}

export interface GeneralAssembly {
    id: number;
    title: string;
    sub_title: string | null;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
    boardMembers: BoardMember[];
}

export interface GeneralAssemblyResponse {
    success: boolean;
    message: string;
    data: GeneralAssembly[];
}

export interface GeneralAssemblyR {
    id: number;
    title: string;
    sub_title: string;
    is_active: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface GeneralAssemblyCreate {
    title: string;
    sub_title: string;
    is_active: boolean;
}
export interface GeneralAssemblyResponse2 {
    success: boolean;
    message: string;
    data: GeneralAssemblyR[];
}