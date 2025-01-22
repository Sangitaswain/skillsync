import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const CompanyForgotPassword = () => {
    const [companyEmail, setCompanyEmail] = useState("");
    const { companyforgotPassword, isLoading, error } = useAuthStore();

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!companyEmail) {
            toast.error("Please enter your email");
            return false;
        }
        if (!emailRegex.test(companyEmail)) {
            toast.error("Invalid email address");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await companyforgotPassword(companyEmail);
            toast.success("Reset link sent to your email");
            setCompanyEmail("");
        } catch (error) {
            toast.error(error.response?.data?.msg || "Failed to send reset link");
        }
    };

    return (
        <div className='p-3 bg-[#EFF6FF] flex h-screen w-screen'>
            {/* Left sidebar */}
            <div className='w-[434px] h-full rounded-xl bg-[#1F479A] px-6 py-8 flex flex-col justify-end'>
                <div className='flex items-center gap-1 -ml-1'>
                    <ArrowLeft size={20} color='white'/>
                    <Link to="/auth/company-login">
                        <p className='text-white'>Back to Login</p>
                    </Link>
                </div>
            </div>

            {/* Main content */}
            <div className='h-full w-full flex flex-col justify-center items-center'>
                <div className='w-[476px]'>
                    <h1 className='text-start text-3xl text-[#1F479A] font-bold'>Reset Password</h1>
                    <p className='mt-4 text-gray-600'>Enter your email address and we'll send you a link to reset your password.</p>

                    <form onSubmit={handleSubmit} className='mt-8 flex flex-col gap-4'>
                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}

                        <div className="flex flex-col gap-1">
                            <span className="text-sm text-gray-600">Email</span>
                            <input 
                                type="email"
                                value={companyEmail}
                                onChange={(e) => setCompanyEmail(e.target.value)}
                                className="px-4 py-2 rounded-xl border border-[#BCC3D0] w-[476px]"
                                placeholder="johndoe@example.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-[476px] bg-[#1F479A] rounded-xl py-2.5 text-white mt-4"
                        >
                            {isLoading ? (
                                <div className="flex justify-center items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                                    Sending...
                                </div>
                            ) : (
                                "Send Reset Link"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompanyForgotPassword;