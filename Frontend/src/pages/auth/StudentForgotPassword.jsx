import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const StudentForgotPassword = () => {
    const [email, setEmail] = useState('');
    const { studentforgotpassword, error, isLoading } = useAuthStore();

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            toast.error('Please enter your email address.');
            return false;
        }
        if (!emailRegex.test(email)) {
            toast.error('Invalid email address.');
            return false;
            }
        return true;
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
    
        try {
            const response = await studentforgotpassword(email);
            if (response) {
                toast.success('Reset link sent to your email');
                setEmail('');
            }
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Error sending reset link');
        }
    };

    return (
        <div className='p-3 bg-[#EFF6FF] flex h-screen w-screen'>
            {/* Left sidebar */}
            <div className='w-[434px] h-full rounded-xl bg-primary px-6 py-8 flex flex-col justify-end'>
                <div className='flex items-center gap-1 -ml-1'>
                    <ArrowLeft size={20} color='white'/>
                    <Link to="/auth/student-login">
                        <p className='text-white'>Back to Login</p>
                    </Link>
                </div>
            </div>

            {/* Main content */}
            <div className='h-full w-full flex flex-col justify-center items-center'>
                <div className='w-[476px]'>
                    <h1 className='text-start text-3xl text-primary font-bold'>Forgot Password</h1>
                    <p className='mt-4 text-gray-600'>Enter your email address below to receive password reset instructions.</p>

                    <form onSubmit={handleSubmit} className='mt-8'>
                        {error && (
                            <div className="text-red-500 text-sm mb-4">{error}</div>
                        )}

                        <div className="flex flex-col gap-1">
                            <span className="text-sm text-gray-600">Email Address</span>
                            <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="px-4 py-2 rounded-xl border border-[#BCC3D0] w-[476px]"
                                placeholder="example@email.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-[476px] bg-primary rounded-xl py-2.5 text-white mt-6"
                        >
                            {isLoading ? (
                                <div className="flex justify-center items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                                    Sending Reset Link...
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

export default StudentForgotPassword;