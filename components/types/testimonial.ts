export interface Testimonial {
    id: number;
    clientImg: string;
    clientName: string;
    review: string;
    post: string;
    is_active:boolean;
    createdAt: string;
    updatedAt: string;
}

export interface TestimonialResponse {
    success: boolean;
    message: string;
    data: Testimonial[];
}
export interface TestimonialCreate {
    clientImg: string;
    clientName: string;
    review: string;
    post: string;
    is_active:boolean;
}