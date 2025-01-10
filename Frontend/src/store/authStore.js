import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5005/api/auth" : "/api/auth";
console.log("API_URL:", API_URL);

const useAuthStore = create((set) => ({
    // State for both user and company
    user: null,
    company: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,

    // User Authentication
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

    // Company Authentication
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
            console.error('Full error details:', {  // Expanded error logging
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                config: error.config
            });
            set({ error: error.response?.data?.message || "Error signing up", isLoading: false });
            throw error;
        }
    },


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
    
   

    CompanyLogout: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/company-logout`, {}, {
                withCredentials: true
                });

                if (response && response.data) {
                    set({ company: null, isAuthenticated: false,error : null, isLoading: false });
                    return true;
                }else {
                    throw new Error("Error logging out");
                }
        } catch (error) {
            set({ error: error.response?.data?.message || "Error logging out", isLoading: false });
            throw error;
        }
    },

    verifyCompanyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/verify-company-email`, 
                { code },
                { withCredentials: true }  // Add this configuration object
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
    // Common Authentication Checks
    studentcheckAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            
            const response = await axios.get(`${API_URL}/student-check-auth`);
    

            set({ user: response.data.newUser, isAuthenticated: true, isCheckingAuth: false });
        } catch (error) {
            set({ 
                user:null ,
                error: error.response?.data?.message || "Authentication failed", 
                isCheckingAuth: false, 
                isAuthenticated: false });
        }
    },

    companycheckAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/company-check-auth`, {
                withCredentials: true  // Important: Add this
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


    // Password Reset Functions
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