import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2, GraduationCap } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

const CompanyLogin = () => {
    const navigate = useNavigate();
    
    // Fix: Use selective state picking to prevent infinite loops
    const CompanyLogin = useAuthStore(state => state.CompanyLogin);
    const isLoading = useAuthStore(state => state.isLoading);
    const error = useAuthStore(state => state.error);

    const [formData, setFormData] = useState({
        companyEmail: "",
        password: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!formData.companyEmail || !formData.password) {
            toast.error("Please fill all fields")
            return false
        }
        if (!emailRegex.test(formData.companyEmail)) {
            toast.error("Invalid email address")
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) {
            return;
        }
        
        try {
            console.log('Attempting login with:', {
                url: `${import.meta.env.MODE === "development" ? "http://localhost:5005/api/auth" : "/api/auth"}/company-login`,
                email: formData.companyEmail
            });
            
            await CompanyLogin(formData.companyEmail, formData.password)
            toast.success("Login successful")
            navigate("/auth/company-dashboard")
        } catch (error) {
            console.error('Login error details:', {
                status: error.response?.status,
                data: error.response?.data,
                url: error.config?.url,
                message: error.message
            });
            toast.error(error.response?.data?.message || "Error logging in")
        }
    }

    return (
        <div className='p-3 bg-[#EFF6FF] flex h-screen w-screen'>
            {/* left side */}
            <div className='w-[434px] h-full rounded-xl transition-all duration-1000 ease-in-out bg-[#1F479A] px-6 py-8 flex flex-col justify-end'>
                <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-1 -ml-1'>
                        <ArrowLeft size={20} color='white'/>
                        <Link to={"/"}>
                            <p className='text-white'>Back to Home</p>
                        </Link>
                    </div>
                    <Link to={"/auth/company-signup"}>
                        <span className='text-white'>Sign Up?</span>
                    </Link>
                </div>
            </div>
    
            {/* right side */}
            <div className='h-full w-full flex flex-col justify-center items-center'>
                <div className='w-[476px]'>
                    {/* heading */}
                    <div className='flex w-full items-start'>
                        <h1 className='text-start text-3xl text-[#1F479A] font-bold'>Welcome Back!</h1>
                    </div>
    
                    {/* button to switch bw student and company */}
                    <div className="bg-white rounded-full shadow-lg p-1 mt-8 flex gap-1">
                        <Link to="/auth/student-login">
                            <div className='w-[232px] py-4 justify-center rounded-full transition-all items-center flex gap-2 duration-500 ease-in-out bg-[#F6F6F6] text-gray-600'>
                                <GraduationCap size={24}/>
                                <p>I'm a Student</p>
                            </div>
                        </Link>
                        <Link to="/auth/company-login">
                            <div className='w-[232px] py-4 justify-center rounded-full transition-all items-center flex gap-2 duration-500 ease-in-out bg-[#1F479A] text-white'>
                                <Building2 size={20}/>
                                <p>I'm a Company</p>
                            </div>
                        </Link>
                    </div>

                    {/* company login form */}
                    <form onSubmit={handleSubmit} className='mt-8 flex flex-col gap-4'>
                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}
                        
                        {/* email */}
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
    
                        {/* password */}
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
                            <div className="flex justify-end mt-2">
                                <Link 
                                    to="/auth/forgot-password"
                                    className="text-sm text-[#1F479A] hover:underline"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>
    
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-[476px] bg-[#1F479A] rounded-xl py-2.5 text-white mt-4"
                        >
                            {isLoading ? (
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