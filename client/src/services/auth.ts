import axios from 'axios';

const API_URL = '/api';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export const authService = {
    login: async (username: string, password: string): Promise<string> => {
        const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, {
            username,
            password
        });
        return response.data.token;
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    getToken: (): string | null => {
        return localStorage.getItem('token');
    },

    setToken: (token: string) => {
        localStorage.setItem('token', token);
    }
}; 