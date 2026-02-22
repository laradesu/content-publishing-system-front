
export interface Donate {
    id: number;
    title: string;
    accountNumber: string,
    swiftCode: string;
    is_active: boolean,
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}
export interface Donatecreate {
    title: string;
    accountNumber: string;
    swiftCode: string;
    is_active: boolean,
}
export interface DonateResponse {
    success: boolean;
    message: string;
    data: Donate[];
}

export interface Member {
    id: number;
    title: string;
    fullName: string,
    email: string;
    phoneNumber: string;
    username: string,
    volunteerType: string,
    is_active: boolean,
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}
export interface Membercreate {
    title: string,
    fullName: string,
    email: string;
    phoneNumber: string;
    username: string,
    password: string;
    volunteerType: string,
    is_active: boolean,
}
export interface MemberResponse {
    success: boolean;
    message: string;
    data: Member[];
}

export interface Voluneter {
    id: number;
    title: string,
    content: string,
    fullName: string;
    description: string;
    promised_on: string,
    is_active: boolean,
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}
export interface Volunetercreate {
    title: string,
    content: string,
    fullName: string;
    description: string;
    promised_on: string,
    is_active: boolean,
}
export interface VoluneterResponse {
    success: boolean;
    message: string;
    data: Voluneter[];
}