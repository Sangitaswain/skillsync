/**
 * CompanyDashboard.js
 * A comprehensive dashboard component for company users to manage their profile and activities
 * 
 * This component provides a complete interface including:
 * - Navigation sidebar with company information
 * - Overview statistics
 * - Company profile information display
 * - Job roles and expertise areas visualization
 */

import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
// Import icons for the dashboard interface
import { Building2, BriefcaseIcon, Users2, ClipboardCheck, Settings, LogOut } from 'lucide-react'
// Import authentication store for managing company state
import useAuthStore from '../store/authStore'
// Import toast for showing notification messages
import toast from 'react-hot-toast'

const CompanyDashboard = () => {
    // Initialize navigation hook for redirect after logout
    const navigate = useNavigate();
    
    // Get company data and logout function from auth store
    const company = useAuthStore(state => state.company);
    const CompanyLogout = useAuthStore(state => state.CompanyLogout);

    /**
     * Handle company logout process
     * Shows success/error notifications and redirects to login page
     */
    const handleLogout = async () => {
        try {
            const success = await CompanyLogout();
            if (success) {
                toast.success('Logged out successfully');
                navigate('/auth/company-login');
            } else {
                toast.error('Failed to logout');
            }
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Error during logout');
        }
    }

    return (
        <div className="flex h-screen">
            {/* Left Sidebar: Contains company branding and navigation menu */}
            <div className="w-64 bg-[#1F479A] text-white p-6 flex flex-col">
                {/* Company branding section with logo and basic info */}
                <div className="flex items-center gap-3 mb-8">
                    <Building2 size={32} />
                    <div>
                        <h2 className="font-bold text-lg">{company?.companyName || 'Company Name'}</h2>
                        <p className="text-sm opacity-70">{company?.industryType || 'Industry'}</p>
                    </div>
                </div>

                {/* Navigation menu with links to different sections */}
                <nav className="flex-1">
                    <ul className="space-y-4">
                        {/* Dashboard link - highlighted as active */}
                        <li>
                            <Link to="/auth/company-dashboard" className="flex items-center gap-3 p-3 bg-white/10 rounded-xl">
                                <ClipboardCheck size={20} />
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        {/* Job postings management link */}
                        <li>
                            <Link to="/auth/company/job-postings" className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl">
                                <BriefcaseIcon size={20} />
                                <span>Job Postings</span>
                            </Link>
                        </li>
                        {/* Candidates management link */}
                        <li>
                            <Link to="/auth/company/candidates" className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl">
                                <Users2 size={20} />
                                <span>Candidates</span>
                            </Link>
                        </li>
                        {/* Settings page link */}
                        <li>
                            <Link to="/auth/company/settings" className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl">
                                <Settings size={20} />
                                <span>Settings</span>
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Logout button at the bottom of sidebar */}
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl w-full mt-4"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-8 bg-[#EFF6FF] overflow-y-auto">
                {/* Dashboard header with welcome message */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#1F479A]">Company Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {company?.pointOfContactFirstName || 'User'}!</p>
                </div>

                {/* Statistics Grid: Shows key metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Active job postings counter */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-gray-500 mb-2">Active Job Postings</h3>
                        <p className="text-2xl font-bold">0</p>
                    </div>
                    {/* Total applications counter */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-gray-500 mb-2">Total Applications</h3>
                        <p className="text-2xl font-bold">0</p>
                    </div>
                    {/* Shortlisted candidates counter */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-gray-500 mb-2">Shortlisted Candidates</h3>
                        <p className="text-2xl font-bold">0</p>
                    </div>
                </div>

                {/* Company Information Card: Displays basic company details */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold mb-4">Company Information</h2>
                    <div className="grid grid-cols-2 gap-6">
                        {/* Industry type */}
                        <div>
                            <p className="text-gray-500 mb-1">Industry</p>
                            <p className="font-medium">{company?.industryType || 'Not specified'}</p>
                        </div>
                        {/* Company location */}
                        <div>
                            <p className="text-gray-500 mb-1">Location</p>
                            <p className="font-medium">{company?.headquarterLocation || 'Not specified'}</p>
                        </div>
                        {/* Company size */}
                        <div>
                            <p className="text-gray-500 mb-1">Company Size</p>
                            <p className="font-medium">{company?.companySize || 'Not specified'} employees</p>
                        </div>
                        {/* Establishment year */}
                        <div>
                            <p className="text-gray-500 mb-1">Established</p>
                            <p className="font-medium">{company?.yearOfEstablishment || 'Not specified'}</p>
                        </div>
                    </div>
                </div>

                {/* Job Roles and Expertise Section: Two cards showing company specialties */}
                <div className="grid grid-cols-2 gap-6 mt-6">
                    {/* Job roles card: Shows all job roles as tags */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold mb-4">Job Roles</h2>
                        <div className="flex flex-wrap gap-2">
                            {company?.jobRoles && Object.keys(company.jobRoles).map((role) => (
                                <span key={role} className="bg-[#EFF6FF] text-[#1F479A] px-3 py-1 rounded-full text-sm">
                                    {role}
                                </span>
                            ))}
                        </div>
                    </div>
                    {/* Areas of expertise card: Shows company's expertise areas as tags */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold mb-4">Areas of Expertise</h2>
                        <div className="flex flex-wrap gap-2">
                            {company?.areasOfExpertiseSought && Object.keys(company.areasOfExpertiseSought).map((area) => (
                                <span key={area} className="bg-[#EFF6FF] text-[#1F479A] px-3 py-1 rounded-full text-sm">
                                    {area}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyDashboard