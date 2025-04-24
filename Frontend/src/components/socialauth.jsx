import React, { useState } from 'react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore'; // Add this import

const SocialAuthButtons = ({ type = "Sign In" }) => {
    const [isLoading, setIsLoading] = useState({
        google: false,
        microsoft: false
    });
    const { initiateGoogleAuth } = useAuthStore(); // Get the method from auth store

    const handleGoogleAuth = async () => {
        try {
            setIsLoading(prev => ({ ...prev, google: true }));
            await initiateGoogleAuth();
        } catch (error) {
            setIsLoading(prev => ({ ...prev, google: false }));
            toast.error("Failed to connect with Google");
            console.error("Google auth error:", error);
        }
    };

    // Updated handleMicrosoftAuth function in your SocialAuthButtons component

const handleMicrosoftAuth = () => {
    try {
        setIsLoading(prev => ({ ...prev, microsoft: true }));
        const microsoftAuthUrl = `${import.meta.env.VITE_API_URL}/api/auth/microsoft`;
        window.location.href = microsoftAuthUrl;
    } catch (error) {
        setIsLoading(prev => ({ ...prev, microsoft: false }));
        toast.error("Failed to connect with Microsoft");
        console.error("Microsoft auth error:", error);
    }
};

    return (
        <div className="w-[476px] mt-4">
            {/* Divider */}
            <div className="flex items-center gap-2 w-full mb-4">
                <div className="h-[1px] flex-1 bg-gray-300" />
                <span className="text-sm text-gray-500">or</span>
                <div className="h-[1px] flex-1 bg-gray-300" />
            </div>
            
            {/* Social Buttons Container */}
            <div className="flex gap-4 w-full">
                {/* Google Button */}
                <button
                    onClick={handleGoogleAuth}
                    disabled={isLoading.google}
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-[#BCC3D0] rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading.google ? (
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                    )}
                    <span className="text-gray-700">
                        {isLoading.google ? 'Connecting...' : `${type} with Google`}
                    </span>
                </button>

                {/* Microsoft Button */}
                <button
                    onClick={handleMicrosoftAuth}
                    disabled={isLoading.microsoft}
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-[#BCC3D0] rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading.microsoft ? (
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 0H0V10H10V0Z" fill="#F25022"/>
                            <path d="M21 0H11V10H21V0Z" fill="#7FBA00"/>
                            <path d="M10 11H0V21H10V11Z" fill="#00A4EF"/>
                            <path d="M21 11H11V21H21V11Z" fill="#FFB900"/>
                        </svg>
                    )}
                    <span className="text-gray-700">
                        {isLoading.microsoft ? 'Connecting...' : `${type} with Microsoft`}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default SocialAuthButtons;