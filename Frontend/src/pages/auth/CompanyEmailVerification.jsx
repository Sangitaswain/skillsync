// Import necessary dependencies and hooks
import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";

// Component for handling company email verification through a 6-digit code
const CompanyEmailVerification = () => {
    // State to store the 6-digit verification code as an array
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    // Refs to manage focus on input fields
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    // Get authentication related functions and states from the auth store
    const { error, isLoading, verifyCompanyEmail } = useAuthStore();





    // Handle input change in the verification code fields
    // Only allows digits and automatically moves focus to next input
    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // Only allow digits
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        // Auto-focus next input field after entering a digit
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };





    // Handle pasting of verification code
    // Cleans pasted text to only include numbers and distributes across inputs
    const handlePaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
        const newCode = [...code];
        for (let i = 0; i < 6; i++) {
            newCode[i] = pastedText[i] || "";
        }
        setCode(newCode);
        
        // Focus the next empty input or the last input if all are filled
        const nextEmptyIndex = newCode.findIndex(digit => !digit);
        const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
        inputRefs.current[focusIndex]?.focus();
    };



    // Handle backspace key for better user experience
    // Moves focus to previous input when backspace is pressed on empty input
    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };



    // Handle form submission with verification code
    // Validates complete code entry and calls verification API
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (code.some((digit) => !digit)) {
            toast.error("Please enter the complete verification code");
            return;
        }
    
        const verificationCode = code.join("");
        try {
            const response = await verifyCompanyEmail(verificationCode);
            if (response && response.success) {
                toast.success("Email verified successfully");
                navigate("/auth/company-dashboard", { replace: true });
            } else {
                toast.error("Failed to verify email");
            }
        } catch (error) {
            console.error("Error details:", error.response?.data);
            toast.error(error.response?.data?.msg || "Error verifying email");
        }
    };



    // Auto-submit when all digits are entered
    useEffect(() => {
        if (code.every(digit => digit !== "")) {
            handleSubmit(new Event("submit"));
        }
    }, [code]);


    

    // UI Component rendering
    return (
        // Main container with blue background
        <div className="h-screen w-screen bg-[#EFF6FF] p-3 flex">
            {/* Left sidebar with navigation */}
            <div className="w-[434px] h-full rounded-xl bg-[#1F479A] px-6 py-8 flex flex-col justify-between">
                {/* Back navigation button */}
                <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-1 -ml-1'>
                        <ArrowLeft size={20} color='white'/>
                        <Link to="/">
                            <p className='text-white'>Back to Home</p>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main verification form container */}
            <div className="h-full w-full flex flex-col justify-center items-center">
                <div className="w-[476px]">
                    {/* Form header and instructions */}
                    <h2 className="text-2xl font-bold text-[#1F479A] mb-4">Verify Your Email</h2>
                    <p className="text-gray-600 mb-8">Enter the 6-digit code sent to your email address.</p>

                    {/* Verification code input form */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* 6-digit code input fields */}
                        <div className="flex justify-between gap-4">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    className="w-[72px] h-[72px] text-center text-2xl font-bold bg-white border border-[#BCC3D0] rounded-xl focus:border-[#1F479A] focus:outline-none"
                                />
                            ))}
                        </div>

                        {/* Error message display */}
                        {error && (
                            <p className="text-red-500 font-medium">{error}</p>
                        )}

                        {/* Submit button with loading state */}
                        <button
                            type="submit"
                            disabled={isLoading || code.some((digit) => !digit)}
                            className="w-full bg-[#1F479A] rounded-xl py-2.5 text-white disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Verifying...
                                </div>
                            ) : (
                                "Verify"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompanyEmailVerification;