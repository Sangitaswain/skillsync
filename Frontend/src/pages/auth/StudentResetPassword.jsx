import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const StudentResetPassword = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirm_Password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();
    const { studentresetpassword, isLoading, error } = useAuthStore();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.password || !formData.confirm_Password) {
            toast.error("Please fill all fields");
            return false;
        }
        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return false;
        }
        if (formData.password !== formData.confirm_Password) {
            toast.error("Passwords do not match");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            
            await studentresetpassword(token, formData.password);
            toast.success("Password reset successful");
            navigate('/auth/student-login');
        } catch (error) {
            toast.error(error.response?.data?.msg || "Failed to reset password");
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
                    <h1 className='text-start text-3xl text-primary font-bold'>Reset Password</h1>
                    <p className='mt-4 text-gray-600'>Enter your new password below.</p>

                    <form onSubmit={handleSubmit} className='mt-8 flex flex-col gap-4'>
                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}

                        <div className="flex flex-col gap-1">
                            <span className="text-sm text-gray-600">New Password</span>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="px-4 py-2 rounded-xl border border-[#BCC3D0] w-[476px]"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-sm text-gray-600">Confirm New Password</span>
                            <div className="relative">
                                <input 
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirm_Password"
                                    value={formData.confirm_Password}
                                    onChange={handleInputChange}
                                    className="px-4 py-2 rounded-xl border border-[#BCC3D0] w-[476px]"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-[476px] bg-primary rounded-xl py-2.5 text-white mt-4"
                        >
                            {isLoading ? (
                                <div className="flex justify-center items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                                    Resetting Password...
                                </div>
                            ) : (
                                "Reset Password"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentResetPassword;