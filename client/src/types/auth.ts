export interface SignInData {
    username: string;
    password: string;
}

export interface SignUpData {
    fullName: string;
    email: string;
    username: string;
    password: string;
}

export interface SignUpErrorResponse {
    email?: string;
    password?: string;
    username?: string;
    fullName?: string;
}