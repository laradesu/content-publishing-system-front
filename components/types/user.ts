export interface User {
    id: number;
    title: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    username: string;
    password: string;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UserResponse {
    success: boolean;
    message: string;
    data: User[];
}
export interface UserCreate {
    title: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    username: string;
    password: string;
    is_active: boolean;
}

export interface LoggedInUser {
    id: number;
    title: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    username: string;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UserLoginResponse {
    success: boolean;
    message?: string;
    data: {
        token: string;
        user: LoggedInUser;
    };
}
export interface GetUserByIdResponse {
    success: boolean;
    message?: string;
    data: LoggedInUser;
}

export interface UserLoginCreate {
    username: string;
    password: string;
}
