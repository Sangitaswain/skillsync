import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';

// Page Imports
import LandingPage from './pages/LandingPage'
import StudentDashboard from './pages/StudentDashboard'
import CompanyDashboard from './pages/CompanyDashboard'

// Auth Components
import StudentSignup from './pages/auth/StudentSignup'
import CompanySignup from './pages/auth/CompanySignup'
import StudentLogin from './pages/auth/StudentLogin'
import CompanyLogin from './pages/auth/CompanyLogin'
import StudentEmailVerification from './pages/auth/StudentEmailVerification'
import CompanyEmailVerification from './pages/auth/CompanyEmailVerification'
import StudentForgotPassword from './pages/auth/StudentForgotPassword'
import StudentResetPassword from './pages/auth/StudentResetPassword'
import CompanyForgotPassword from './pages/auth/CompanyForgotPassword'
import CompanyResetPassword from './pages/auth/CompanyResetPassword'

// Store
import useAuthStore from './store/authStore'

// Google Auth Callback Component
const GoogleCallback = () => {
    const location = useLocation();
    
    useEffect(() => {
        // Check if the URL has parameters that indicate an error
        const urlParams = new URLSearchParams(location.search);
        const error = urlParams.get('error');
        const code = urlParams.get('code');
        
        console.log('Google callback received:', { hasError: !!error, hasCode: !!code });

        if (error) {
            console.error('Google auth error:', error);
            window.location.href = '/auth/student-login?error=google_auth_failed';
        } else if (!code) {
            // If there's no code and no error, there might be an issue with the callback
            console.error('Google callback missing required parameters');
            window.location.href = '/auth/student-login?error=invalid_callback';
        }
        // Backend will handle successful auth and redirect to dashboard
    }, [location]);

    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-[#1F479A] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Processing your Google login...</p>
            </div>
        </div>
    );
};

const MicrosoftCallback = () => {
    const location = useLocation();
    const { handleMicrosoftCallback } = useAuthStore();
    
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (code) {
            handleMicrosoftCallback(code)
                .then(() => {
                    window.location.href = '/auth/student-dashboard';
                })
                .catch((error) => {
                    console.error('Microsoft callback error:', error);
                    window.location.href = '/auth/student-login?error=microsoft_auth_failed';
                });
        } else if (error) {
            console.error('Microsoft auth error:', error);
            window.location.href = '/auth/student-login?error=microsoft_auth_failed';
        }
    }, [location, handleMicrosoftCallback]);

    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#1F479A] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
};


// Route Protection Components
const ProtectedCompanyRoute = ({ children }) => {
    const { isAuthenticated, company, isCheckingAuth } = useAuthStore();
    
    if (isCheckingAuth) {
        return null;
    }

    if (isAuthenticated && company?.isVerified) {
        return children;
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/company-login" replace />;
    }
    
    if (!company?.isVerified) {
        return <Navigate to="/auth/verify-company-email" replace />;
    }
    
    return children;
};

const ProtectedStudentRoute = ({ children }) => {
    const { isAuthenticated, user, isCheckingAuth } = useAuthStore();
    
    if (isCheckingAuth) {
        return null;
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/auth/student-login" replace />;
    }
    
    if (!user?.isVerified) {
        return <Navigate to="/auth/verify-student-email" replace />;
    }
    
    return children;
};

// Redirect Components
const RedirectAuthenticatedCompany = ({ children }) => {
    const { isAuthenticated, company } = useAuthStore();
    
    if (isAuthenticated && company?.isVerified) {
        return <Navigate to="/auth/company-dashboard" replace />;
    }
    
    return children;
};

const RedirectAuthenticatedStudent = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();
    
    if (isAuthenticated && user?.isVerified) {
        return <Navigate to="/auth/student-dashboard" replace />;
    }
    
    return children;
};

function App() {
    const { isCheckingAuth, companycheckAuth, studentcheckAuth } = useAuthStore();

    useEffect(() => {
        companycheckAuth();
        studentcheckAuth();
    }, [companycheckAuth, studentcheckAuth]);

    if (isCheckingAuth) {
        return (
            <div className="h-screen w-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#1F479A] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-center" containerStyle={{left: 350}}/>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Google Auth Route */}
                <Route path="/auth/google/callback" element={<GoogleCallback />} />
                
                {/* Company Routes */}
                <Route path="/auth/company-login" element={
                    <RedirectAuthenticatedCompany>
                        <CompanyLogin />
                    </RedirectAuthenticatedCompany>
                } />
                <Route path="/auth/company-signup" element={
                    <RedirectAuthenticatedCompany>
                        <CompanySignup />
                    </RedirectAuthenticatedCompany>
                } />
                <Route path="/auth/company-dashboard" element={
                    <ProtectedCompanyRoute>
                        <CompanyDashboard />
                    </ProtectedCompanyRoute>
                } />
                <Route path="/auth/verify-company-email" element={<CompanyEmailVerification />} />
                <Route path="/auth/company-forgot-password" element={<CompanyForgotPassword />} />
                <Route path="/auth/company-reset-password/:token" element={<CompanyResetPassword />} />

                {/* Student Routes */}
                <Route path="/auth/student-login" element={
                    <RedirectAuthenticatedStudent>
                        <StudentLogin />
                    </RedirectAuthenticatedStudent>
                } />
                <Route path="/auth/student-signup" element={
                    <RedirectAuthenticatedStudent>
                        <StudentSignup />
                    </RedirectAuthenticatedStudent>
                } />
                <Route path="/auth/student-dashboard" element={
                    <ProtectedStudentRoute>
                        <StudentDashboard />
                    </ProtectedStudentRoute>
                } />
                <Route path="/auth/verify-student-email" element={<StudentEmailVerification />} />
                <Route path="/auth/student-forgot-password" element={<StudentForgotPassword />} />
                <Route path="/auth/student-reset-password/:token" element={<StudentResetPassword />} />
                <Route path="/auth/microsoft/callback" element={<MicrosoftCallback />} />

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}

export default App;