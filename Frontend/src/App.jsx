import React from 'react'
import { useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import StudentDashboard from './pages/StudentDashboard'
import StudentSignup from './pages/auth/StudentSignup'
import { Routes, Route, Navigate } from 'react-router-dom'
import CompanySignup from './pages/auth/CompanySignup'
import StudentLogin from './pages/auth/StudentLogin'
import CompanyLogin from './pages/auth/CompanyLogin'
import { Toaster } from 'react-hot-toast';

import CompanyDashboard from './pages/CompanyDashboard'
import StudentEmailVerification from './pages/auth/StudentEmailVerification'
import CompanyEmailVerification from './pages/auth/CompanyEmailVerification'
import useAuthStore from './store/authStore'


  // Protect routes for both types of users
  const ProtectedCompanyRoute = ({ children }) => {
    const { isAuthenticated, company, isCheckingAuth } = useAuthStore();
    
    console.log('Protected Route State:', { 
        isAuthenticated, 
        hasCompany: !!company,
        isVerified: company?.isVerified,
        isCheckingAuth 
    });
    
    if (isCheckingAuth) {
        return null;
    }

    // If authenticated and verified, render children immediately
    if (isAuthenticated && company?.isVerified) {
        return children;
    }

    // Only redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/auth/company-login" replace />;
    }
    
    // Redirect to verification if authenticated but not verified
    if (!company?.isVerified) {
        return <Navigate to="/auth/verify-company-email" replace />;
    }
    
    return children;
};

const ProtectedStudentRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
      return <Navigate to="/auth/student-login" replace />;
  }
  
  if (!user?.isVerified) {
      return <Navigate to="/auth/verify-student-email" replace />;
  }
  
  return children;
};

// Redirect authenticated users based on type
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

  if (isCheckingAuth) return (
    <div className="h-screen w-screen flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#1F479A] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

  

  return (
    <>

    <Toaster position="top-center"  containerStyle={{left: 350}}/>
      <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          
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

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    
      </>
  );
};

export default App;
