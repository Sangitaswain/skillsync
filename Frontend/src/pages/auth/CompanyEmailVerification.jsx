import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";

const CompanyEmailVerification = () => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const { error, isLoading, verifyCompanyEmail, resendVerificationOTP, company} = useAuthStore();

    // Timer for OTP expiry
    useEffect(() => {
        if (timeLeft <= 0) {
            setCanResend(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Format time remaining
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
        const newCode = [...code];
        for (let i = 0; i < 6; i++) {
            newCode[i] = pastedText[i] || "";
        }
        setCode(newCode);
        
        const nextEmptyIndex = newCode.findIndex(digit => !digit);
        const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
        inputRefs.current[focusIndex]?.focus();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (code.some((digit) => !digit)) {
            toast.error("Please enter the complete verification code");
            return;
        }
    
        try {
            const response = await verifyCompanyEmail(code.join(""));
            if (response.success) {
                toast.success("Email verified successfully");
                setTimeout(() => navigate("/auth/company-dashboard"), 500);
            }
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error verifying email");
            setCode(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        }
    };
    // Handle resend OTP
    const handleResendOTP = async () => {
        try {
            const response = await resendVerificationOTP(company.companyEmail);
            if (response.success) {
                toast.success("New verification code sent successfully");
                setTimeLeft(600); // Reset timer to 10 minutes
                setCanResend(false);
                // Clear previous code
                setCode(["", "", "", "", "", ""]);
                inputRefs.current[0]?.focus();
            } else {
                toast.error("Failed to send new verification code");
            }
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error sending new code");
        }
    };
    // Auto-submit when all digits are entered
    useEffect(() => {
        if (code.every(digit => digit !== "")) {
            handleSubmit(new Event("submit"));
        }
    }, [code]);

    return (
        <div className="h-screen w-screen bg-[#EFF6FF] p-3 flex">
            <div className="w-[434px] h-full rounded-xl bg-[#1F479A] px-6 py-8 flex flex-col justify-between">
                <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-1 -ml-1'>
                        <ArrowLeft size={20} color='white'/>
                        <Link to="/">
                            <p className='text-white'>Back to Home</p>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="h-full w-full flex flex-col justify-center items-center">
                <div className="w-[476px]">
                    <h2 className="text-2xl font-bold text-[#1F479A] mb-4">Verify Your Email</h2>
                    <p className="text-gray-600 mb-8">Enter the 6-digit code sent to your email address.</p>

                    <form onSubmit={handleSubmit} className="space-y-8">
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

                        {error && (
                            <p className="text-red-500 font-medium">{error}</p>
                        )}

                        <div className="flex flex-col items-center gap-4">
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

                            <div className="text-center">
                                {!canResend ? (
                                    <p className="text-gray-600">
                                        Resend code in {formatTime(timeLeft)}
                                    </p>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        className="text-[#1F479A] font-medium hover:underline"
                                    >
                                        Resend verification code
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompanyEmailVerification;