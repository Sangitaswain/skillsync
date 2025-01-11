
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

import { ArrowLeft, Building2, GraduationCap } from 'lucide-react'

import useAuthStore from '../../store/authStore'

import toast from 'react-hot-toast'

// Company Login Component - Handles the login functionality for companies
const CompanyLogin = () => {
    // Initialize navigation function from react-router
    const navigate = useNavigate();
    
    // Get required functions and states from auth store
    // Using selective state picking to prevent re-render issues
    const CompanyLogin = useAuthStore(state => state.CompanyLogin);
    const isLoading = useAuthStore(state => state.isLoading);
    const error = useAuthStore(state => state.error);

    // Initialize form state with empty email and password
    const [formData, setFormData] = useState({
        companyEmail: "",
        password: "",
    });

    // Handle input changes for form fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Update form state while preserving other field values
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Validate form inputs before submission
    const validateForm = () => {
        // Regular expression for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        // Check if all fields are filled
        if (!formData.companyEmail || !formData.password) {
            toast.error("Please fill all fields")
            return false
        }
        // Validate email format
        if (!emailRegex.test(formData.companyEmail)) {
            toast.error("Invalid email address")
            return false
        }
        return true
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        // Prevent default form submission
        e.preventDefault()
        // Validate form before proceeding
        if (!validateForm()) {
            return;
        }
        
        try {
            // Log login attempt details in development
            console.log('Attempting login with:', {
                url: `${import.meta.env.MODE === "development" ? "http://localhost:5005/api/auth" : "/api/auth"}/company-login`,
                email: formData.companyEmail
            });
            
            // Attempt login with provided credentials
            await CompanyLogin(formData.companyEmail, formData.password)
            // Show success message
            toast.success("Login successful")
            // Navigate to dashboard on success
            navigate("/auth/company-dashboard")
        } catch (error) {
            // Log detailed error information for debugging
            console.error('Login error details:', {
                status: error.response?.status,
                data: error.response?.data,
                url: error.config?.url,
                message: error.message
            });
            // Show error message to user
            toast.error(error.response?.data?.message || "Error logging in")
        }
    }

    // Component UI Render
    return (
        // Main container with full screen dimensions
        <div className='p-3 bg-[#EFF6FF] flex h-screen w-screen'>
            {/* Left sidebar with navigation options */}
            <div className='w-[434px] h-full rounded-xl transition-all duration-1000 ease-in-out bg-[#1F479A] px-6 py-8 flex flex-col justify-end'>
                {/* Navigation header with back button and signup link */}
                <div className='flex justify-between items-center'>
                    {/* Back to home link */}
                    <div className='flex items-center gap-1 -ml-1'>
                        <ArrowLeft size={20} color='white'/>
                        <Link to={"/"}>
                            <p className='text-white'>Back to Home</p>
                        </Link>
                    </div>
                    {/* Sign up link */}
                    <Link to={"/auth/company-signup"}>
                        <span className='text-white'>Sign Up?</span>
                    </Link>
                </div>
            </div>
    
            {/* Main content area */}
            <div className='h-full w-full flex flex-col justify-center items-center'>
                <div className='w-[476px]'>
                    {/* Welcome header */}
                    <div className='flex w-full items-start'>
                        <h1 className='text-start text-3xl text-[#1F479A] font-bold'>Welcome Back!</h1>
                    </div>
    
                    {/* User type selection buttons (Student/Company) */}
                    <div className="bg-white rounded-full shadow-lg p-1 mt-8 flex gap-1">
                        {/* Student login option */}
                        <Link to="/auth/student-login">
                            <div className='w-[232px] py-4 justify-center rounded-full transition-all items-center flex gap-2 duration-500 ease-in-out bg-[#F6F6F6] text-gray-600'>
                                <GraduationCap size={24}/>
                                <p>I'm a Student</p>
                            </div>
                        </Link>
                        {/* Company login option (active) */}
                        <Link to="/auth/company-login">
                            <div className='w-[232px] py-4 justify-center rounded-full transition-all items-center flex gap-2 duration-500 ease-in-out bg-[#1F479A] text-white'>
                                <Building2 size={20}/>
                                <p>I'm a Company</p>
                            </div>
                        </Link>
                    </div>

                    {/* Login form */}
                    <form onSubmit={handleSubmit} className='mt-8 flex flex-col gap-4'>
                        {/* Error message display */}
                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}
                        
                        {/* Email input field */}
                        <div>
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-gray-600">Email</span>
                                <input 
                                    type="email" 
                                    name="companyEmail"
                                    value={formData.companyEmail}
                                    onChange={handleInputChange}
                                    className="px-4 py-2 rounded-xl border border-[#BCC3D0] w-[476px]"
                                    placeholder="johndoe@example.com"
                                />
                            </div>
                        </div>
    
                        {/* Password input field */}
                        <div>
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-gray-600">Password</span>
                                <input 
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange} 
                                    className="px-4 py-2 rounded-xl border border-[#BCC3D0] w-[476px]"
                                    placeholder="••••••••"
                                />
                            </div>
                            {/* Forgot password link */}
                            <div className="flex justify-end mt-2">
                                <Link 
                                    to="/auth/forgot-password"
                                    className="text-sm text-[#1F479A] hover:underline"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>
    
                        {/* Submit button with loading state */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-[476px] bg-[#1F479A] rounded-xl py-2.5 text-white mt-4"
                        >
                            {isLoading ? (
                                // Loading spinner and text
                                <div className="flex justify-center items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                                    Signing In...
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}


export default CompanyLogin