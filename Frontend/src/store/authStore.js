import { create } from "zustand";
import axios from "axios";

// Enable credentials in axios for handling cookies
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Set API URL based on environment
const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5005/api/auth" : "/api/auth";

// Common axios configuration
const axiosConfig = {
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
};

const useAuthStore = create((set) => ({
    // Global state properties
    user: null,                
    company: null,             
    isAuthenticated: false,    
    error: null,              
    isLoading: false,         
    isCheckingAuth: true,     
    message: null,            

    // Google Authentication Methods
    initiateGoogleAuth: () => {
        try {
            console.log('Initiating Google Auth with URL:', `${API_URL}/google`);
            window.location.href = `${API_URL}/google`;
        } catch (error) {
            console.error('Google Auth Initiation Error:', error);
            set({ error: "Failed to initiate Google authentication" });
            throw error;
        }
    },

    // We don't need this method anymore since auth is handled server-side
    // Keep it as a no-op for backward compatibility
    handleGoogleCallback: async () => {
        console.log('Google callback is now handled server-side');
        return null;
    },

    // Student Authentication Methods
    StudentSignup: async (formData) => {
        set({ isLoading: true, error: null });
        try {
            console.log('Attempting signup with URL:', `${API_URL}/student-signup`);
            const response = await axios.post(`${API_URL}/student-signup`, formData, axiosConfig);
            console.log('Signup response:', response);
            set({user: response.data.user, isAuthenticated: true, isLoading: false});
            return response.data;
        } catch(error) {
            console.error('Signup error:', error);
            set({error: error.response?.data?.message || "Error signing up", isLoading: false});
            throw error;
        }
    },

    StudentLogin: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(
                `${API_URL}/student-login`, 
                { email, password },
                axiosConfig
            );
    
            if (response.data.success) {
                set({ 
                    user: response.data.newUser, 
                    error: null, 
                    isAuthenticated: true, 
                    isLoading: false 
                });
                return response.data;
            }
            throw new Error(response.data.message || 'Login failed');
        } catch (error) {
            set({
                isAuthenticated: false,
                user: null,
                error: error.response?.data?.message || "Error logging in",
                isLoading: false
            });
            throw error;
        }
    },

    StudentLogout: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/student-logout`, {}, axiosConfig);
            if (response.data.success) {
                // Clear all auth state completely
                set({
                    user: null, 
                    company: null,
                    isAuthenticated: false, 
                    error: null, 
                    isLoading: false
                });
                
                // Also clear cookies on the client side if needed
                document.cookie = "usertoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                
                return true;
            }
            throw new Error('Logout failed');
        } catch (error) {
            set({error: error.response?.data?.message || "Error logging out", isLoading: false});
            throw error;
        }
    },

    verifystudentEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(
                `${API_URL}/verify-student-email`, 
                { code },
                axiosConfig
            );
            
            if (response.data.success) {
                set({ 
                    user: {
                        ...response.data.newUser,
                        isVerified: true
                    },
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                });
                return response.data;
            }
            throw new Error(response.data.msg || "Verification failed");
        } catch (error) {
            const errorMsg = error.response?.data?.msg || "Error verifying email";
            set({ error: errorMsg, isLoading: false });
            throw error;
        }
    },

    resendstudentVerificationOTP: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(
                `${API_URL}/resend-student-verification-otp`, 
                { email },
                axiosConfig
            );
     
            if (response.data.success) {
                set({ 
                    message: response.data.msg || "Verification code sent successfully",
                    isLoading: false,
                    error: null 
                });
                return response.data;
            }
            throw new Error(response.data.msg || "Failed to send verification code");
        } catch (error) {
            set({ 
                error: error.response?.data?.msg || "Failed to send verification code",
                isLoading: false 
            });
            throw error;
        }
    },

    // Company Authentication Methods
    CompanySignup: async (formData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/company-signup`, formData, axiosConfig);
            set({ company: response.data.company, isAuthenticated: true, isLoading: false });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || "Error signing up", isLoading: false });
            throw error;
        }
    },

    CompanyLogin: async (companyEmail, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(
                `${API_URL}/company-login`, 
                { companyEmail, password },
                axiosConfig
            );
            
            if (response.data.success) {
                set({
                    isAuthenticated: true,
                    company: response.data.company,
                    error: null,
                    isLoading: false,
                });
                return true;
            }
            throw new Error(response.data.message || 'Login failed');
        } catch (error) {
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
            const response = await axios.post(`${API_URL}/company-logout`, {}, axiosConfig);
            if (response.data.success) {
                set({ company: null, isAuthenticated: false, error: null, isLoading: false });
                return true;
            }
            throw new Error("Error logging out");
        } catch (error) {
            set({ error: error.response?.data?.message || "Error logging out", isLoading: false });
            throw error;
        }
    },

    verifyCompanyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(
                `${API_URL}/verify-company-email`, 
                { code },
                axiosConfig
            );
    
            if (response.data.success) {
                set({ 
                    company: {
                        ...response.data.company,
                        isVerified: true
                    },
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                });
                return response.data;
            }
            throw new Error(response.data.msg || "Verification failed");
        } catch (error) {
            set({ error: error.response?.data?.msg || "Error verifying email", isLoading: false });
            throw error;
        }
    },

    resendcompanyVerificationOTP: async (companyEmail) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(
                `${API_URL}/resend-company-verification-otp`, 
                { companyEmail },
                axiosConfig
            );

            if (response.data.success) {
                set({ 
                    message: response.data.msg || "Verification code sent successfully",
                    isLoading: false,
                    error: null 
                });
                return response.data;
            }
            throw new Error(response.data.msg || "Failed to send verification code");
        } catch (error) {
            set({ 
                error: error.response?.data?.msg || "Failed to send verification code",
                isLoading: false 
            });
            throw error;
        }
    },

    // Authentication Check Methods
    studentcheckAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/student-check-auth`, axiosConfig);
            
            if (response.data && response.data.success) {
                set({ 
                    user: response.data.newUser,
                    isAuthenticated: true, 
                    isCheckingAuth: false,
                    error: null
                });
                return response.data;
            }
            throw new Error('Invalid authentication response');
        } catch (error) {
            set({ 
                user: null,
                isAuthenticated: false,
                isCheckingAuth: false,
                error: error.response?.data?.msg || null
            });
        }
    },

    companycheckAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/company-check-auth`, axiosConfig);
            
            if (response.data.success && response.data.company) {
                set({ 
                    company: {
                        ...response.data.company, 
                        isVerified: response.data.company.isVerified || false
                    },
                    isAuthenticated: true, 
                    isCheckingAuth: false,
                    error: null
                });
            } else {
                throw new Error('Invalid auth response structure');
            }
        } catch (error) {
            set({ 
                company: null,
                error: error.response?.data?.message || null, 
                isCheckingAuth: false, 
                isAuthenticated: false 
            });
        }
    },

    // Password Reset Methods
    studentforgotpassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(
                `${API_URL}/student-forgot-password`, 
                { email },
                axiosConfig
            );
            
            if (response.data) {
                set({ isLoading: false });
                return response.data;
            }
            throw new Error("Failed to send reset email");
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.msg || "Error sending reset email"
            });
            throw error;
        }
    },

    companyforgotpassword: async (companyEmail) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(
                `${API_URL}/company-forgot-password`, 
                { companyEmail },
                axiosConfig
            );
            set({ message: response.data.message, isLoading: false });
            return response.data;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Error sending reset password email",
            });
            throw error;
        }
    },

    studentresetpassword: async (token, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(
                `${API_URL}/student-reset-password/${token}`, 
                { password },
                axiosConfig
            );
            set({ message: response.data.message, isLoading: false });
            return response.data;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Error resetting password",
            });
            throw error;
        }
    },

    companyresetpassword: async (token, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(
                `${API_URL}/company-reset-password/${token}`,
                { password },
                axiosConfig
            );
            set({ message: "Password reset successful", isLoading: false });
            return response.data;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Error resetting password"
            });
            throw error;
        }
    },

    // Microsoft Authentication Methods
    initiateMicrosoftAuth: () => {
        try {
            console.log('Initiating Microsoft Auth with URL:', `${API_URL}/microsoft`);
            window.location.href = `${API_URL}/microsoft`;
        } catch (error) {
            console.error('Microsoft Auth Initiation Error:', error);
            set({ error: "Failed to initiate Microsoft authentication" });
            throw error;
        }
    },

    handleMicrosoftCallback: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(
                `${API_URL}/microsoft/callback`,
                {
                    params: { code },
                    ...axiosConfig
                }
            );

            if (response.data.success) {
                set({
                    user: response.data.user,
                    isAuthenticated: true,
                    error: null,
                    isLoading: false
                });
                return response.data;
            }
            throw new Error(response.data.message || 'Microsoft authentication failed');
        } catch (error) {
            console.error('Microsoft Callback Error:', error);
            set({
                isAuthenticated: false,
                user: null,
                error: error.response?.data?.message || "Microsoft authentication failed",
                isLoading: false
            });
            throw error;
        }
    }
}));




export default useAuthStore;