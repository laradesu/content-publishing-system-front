
export interface ContactUs {
    id: number;
    office_name: string;
    location: string;
    address: string;
    postal_code: string;
    tel: string;
    fax: string;
    email_primary: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}
export interface ContactUscreate {
    office_name: string;
    location: string;
    address: string;
    postal_code: string;
    tel: string;
    fax: string;
    email_primary: string;
}
export interface ContactUsResponse {
    success: boolean;
    message: string;
    data: ContactUs[];
}