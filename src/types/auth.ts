export interface LoginRequest {
    username: string;
    password: string;
}

export interface AuthState {
    username: string | null;
    token: string | null;
    loginLoading: boolean;
}