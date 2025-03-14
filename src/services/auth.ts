import axios from 'axios';

// Define TypeScript interfaces for type safety
export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

/**
 * Authentication service that handles the login API request
 * @param credentials - Object containing username and password
 * @returns Promise that resolves to the login response containing the JWT token
 * 
 * This function:
 * 1. Makes a POST request to the login endpoint
 * 2. Sends the credentials in the request body
 * 3. Returns the response data (token)
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, credentials);
    return response.data;
};

