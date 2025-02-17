import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login, LoginCredentials } from '@/services/auth';
import { toast } from 'react-hot-toast';

/**
 * Custom hook that manages authentication state and operations
 * 
 * This hook uses React Query's useMutation to handle the login process:
 * 1. Manages loading state automatically
 * 2. Handles success and error cases
 * 3. Provides mutation function to trigger login
 * 
 * @returns Object containing login mutation and its state
 */
export const useAuth = () => {
    // Get the navigate function from react-router-dom for redirection
    const navigate = useNavigate();

    // Create a mutation for the login operation
    return useMutation({
        // The actual function that performs the login request
        mutationFn: (credentials: LoginCredentials) => login(credentials),

        // Called when login is successful
        onSuccess: (data) => {
            // Store the JWT token in localStorage for persistent auth state
            localStorage.setItem('token', data.token);
            // Show success message to user
            toast.success('Login successful!');
            // Redirect to the accounts page
            navigate('/accounts');
        },

        // Called when login fails
        onError: (error) => {
            // Show error message to user
            toast.error('Invalid credentials. Please try again.');
            // Log the error for debugging
            console.error('Login error:', error);
        },
    });
};