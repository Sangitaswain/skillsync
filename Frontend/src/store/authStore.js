import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5005/api/auth" : "/api/auth";

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
            await axios.post(`/auth/student-logout`);
            set({ user: null, isAuthenticated: false, error: null, isLoading: false });
        } catch (error) {
            set({ error: "Error logging out", isLoading: false });
            throw error;
        }
    },

    verifystudentEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`/auth/verify-student-email`, { code });
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
            const response = await axios.post(`/auth/company-signup`, formData);
            set({ company: response.data.company, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ error: error.response.data.message || "Error signing up", isLoading: false });
            throw error;
        }
    },

    CompanyLogin: async (companyEmail, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`/auth/company-login`, { companyEmail, password });
            set({
                isAuthenticated: true,
                company: response.data.company,
                error: null,
                isLoading: false,
            });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
            throw error;
        }
    },

    CompanyLogout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(`/auth/company-logout`);
            set({ company: null, isAuthenticated: false, error: null, isLoading: false });
        } catch (error) {
            set({ error: "Error logging out", isLoading: false });
            throw error;
        }
    },

    verifyCompanyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/verify-company-email`, { code });
            console.log("Verification response:", response); // Add this
            if (response && response.data) {
                set({ company: response.data.company, isAuthenticated: true, isLoading: false });
                return response.data;
            }
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
            
            const response = await axios.get(`/auth/student-check-auth`);
    

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
        
            const response = await axios.get(`/auth/company-check-auth`);
            
            set({ company: response.data.company, isAuthenticated: true, isCheckingAuth: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Authentication failed", isCheckingAuth: false, isAuthenticated: false });
        }
    },


    // Password Reset Functions
    studentforgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`/auth/student-forgot-password`, { email });
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
            const response = await axios.post(`/auth/company-forgot-password`, { companyEmail });
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
            const response = await axios.post(`/auth/student-reset-password/${token}`, { password });
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
            const response = await axios.post(`/auth/company-reset-password/${token}`, { password });
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