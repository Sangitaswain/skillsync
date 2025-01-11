/**
 * Authentication Store (useAuthStore.js)
 * A Zustand store that manages authentication state and operations for both students and companies
 * Handles login, signup, logout, email verification, and password reset functionality
 */

import { create } from "zustand";
import axios from "axios";

// Enable credentials in axios for handling cookies
axios.defaults.withCredentials = true;

// Set API URL based on environment
const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5005/api/auth" : "/api/auth";
console.log("API_URL:", API_URL);





const useAuthStore = create((set) => ({
    // Global state properties
    user: null,                // Stores student user data
    company: null,             // Stores company user data
    isAuthenticated: false,    // Authentication status
    error: null,              // Error message storage
    isLoading: false,         // Loading state for async operations
    isCheckingAuth: true,     // Initial auth check status
    message: null,            // Success/info message storage

    /**
     * Student Authentication Methods
     */
    
    // Register a new student account
    StudentSignup: async (formData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/student-signup`, formData);
            set({ user: response.data.newUser, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ error: error.response.data.message || "Error signing up", isLoading: false });
            throw error;
        }
    },

    // Login existing student
    StudentLogin: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/student-login`, { email, password });
            set({
                isAuthenticated: true,
                user: response.data.newUser,
                error: null,
                isLoading: false,
            });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
            throw error;
        }
    },

    // Logout student user
    StudentLogout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(`${API_URL}/student-logout`);
            set({ user: null, isAuthenticated: false, error: null, isLoading: false });
        } catch (error) {
            set({ error: "Error logging out", isLoading: false });
            throw error;
        }
    },

    // Verify student email address
    verifystudentEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/verify-student-email`, { code });
            set({ user: response.data.newUser, isAuthenticated: true, isLoading: false });
            return response.data;
        } catch (error) {
            set({ error: error.response.data.message || "Error verifying email", isLoading: false });
            throw error;
        }
    },

    /**
     * Company Authentication Methods
     */
    
    // Register a new company account
    CompanySignup: async (formData) => {
        set({ isLoading: true, error: null });
        try {
            console.log('Attempting signup with URL:', `${API_URL}/company-signup`);
            const response = await axios.post(`${API_URL}/company-signup`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log('Signup response:', response.data);
            set({ company: response.data.company, isAuthenticated: true, isLoading: false });
        } catch (error) {
            // Enhanced error logging for debugging
            console.error('Full error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                config: error.config
            });
            set({ error: error.response?.data?.message || "Error signing up", isLoading: false });
            throw error;
        }
    },

    // Login existing company
    CompanyLogin: async (companyEmail, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/company-login`, 
                { companyEmail, password },
                { 
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
    
            console.log('Login response:', response.data);
            
            if (response.data.success) {
                set({
                    isAuthenticated: true,
                    company: response.data.company,
                    error: null,
                    isLoading: false,
                });
                return true;
            } else {
                throw new Error(response.data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            set({ 
                isAuthenticated: false,
                company: null,
                error: error.response?.data?.message || "Error logging in", 
                isLoading: false 
            });
            throw error;
        }
    },

    // Logout company user
    CompanyLogout: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/company-logout`, {}, {
                withCredentials: true
            });

            if (response && response.data) {
                set({ company: null, isAuthenticated: false, error: null, isLoading: false });
                return true;
            } else {
                throw new Error("Error logging out");
            }
        } catch (error) {
            set({ error: error.response?.data?.message || "Error logging out", isLoading: false });
            throw error;
        }
    },

    // Verify company email address
    verifyCompanyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/verify-company-email`, 
                { code },
                { withCredentials: true }
            );
            console.log("Verification response:", response);
    
            if (response && response.data) {
                set({ 
                    company: response.data.company, 
                    isAuthenticated: true, 
                    isLoading: false 
                });
                return response.data;
            }
        } catch (error) {
            const errorMsg = error.response?.data?.msg || "Error verifying email";
            set({ error: errorMsg, isLoading: false });
            throw new Error(errorMsg);
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Authentication Check Methods
     */
    
    // Verify student authentication status
    studentcheckAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/student-check-auth`);
            set({ user: response.data.newUser, isAuthenticated: true, isCheckingAuth: false });
        } catch (error) {
            set({ 
                user: null,
                error: error.response?.data?.message || "Authentication failed", 
                isCheckingAuth: false, 
                isAuthenticated: false 
            });
        }
    },

    // Verify company authentication status
    companycheckAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/company-check-auth`, {
                withCredentials: true
            });
            
            console.log('Auth check response:', response.data);
            
            if (response.data.success && response.data.company) {
                set({ 
                    company: response.data.company, 
                    isAuthenticated: true, 
                    isCheckingAuth: false,
                    error: null
                });
                console.log('Auth state updated:', {
                    hasCompany: !!response.data.company,
                    isAuthenticated: true
                });
            } else {
                console.log('Invalid auth response:', response.data);
                throw new Error('Invalid auth response structure');
            }
        } catch (error) {
            console.error('Auth check error:', {
                status: error.response?.status,
                message: error.response?.data?.message || error.message,
                data: error.response?.data
            });
            
            set({ 
                company: null,
                error: error.response?.data?.message || "Authentication failed", 
                isCheckingAuth: false, 
                isAuthenticated: false 
            });
        }
    },

    /**
     * Password Reset Methods
     */
    
    // Request password reset for student
    studentforgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/student-forgot-password`, { email });
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error: error.response.data.message || "Error sending reset password email",
            });
            throw error;
        }
    },

    // Request password reset for company
    companyforgotPassword: async (companyEmail) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/company-forgot-password`, { companyEmail });
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error: error.response.data.message || "Error sending reset password email",
            });
            throw error;
        }
    },

    // Reset student password with token
    studentresetPassword: async (token, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/student-reset-password/${token}`, { password });
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error: error.response.data.message || "Error resetting password",
            });
            throw error;
        }
    },

    // Reset company password with token
    companyresetPassword: async (token, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/company-reset-password/${token}`, { password });
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error: error.response.data.message || "Error resetting password",
            });
            throw error;
        }
    },
}));

export default useAuthStore;