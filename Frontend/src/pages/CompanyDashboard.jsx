import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, BriefcaseIcon, Users2, ClipboardCheck, Settings, LogOut } from 'lucide-react'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

const CompanyDashboard = () => {
    const navigate = useNavigate();
    
    // Fix: Use separate selectors for each state value
    const company = useAuthStore(state => state.company);
    const CompanyLogout = useAuthStore(state => state.CompanyLogout);

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
            {/* Left Sidebar */}
            <div className="w-64 bg-[#1F479A] text-white p-6 flex flex-col">
                {/* Company Logo/Name Section */}
                <div className="flex items-center gap-3 mb-8">
                    <Building2 size={32} />
                    <div>
                        <h2 className="font-bold text-lg">{company?.companyName || 'Company Name'}</h2>
                        <p className="text-sm opacity-70">{company?.industryType || 'Industry'}</p>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1">
                    <ul className="space-y-4">
                        <li>
                            <Link to="/auth/company-dashboard" className="flex items-center gap-3 p-3 bg-white/10 rounded-xl">
                                <ClipboardCheck size={20} />
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/auth/company/job-postings" className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl">
                                <BriefcaseIcon size={20} />
                                <span>Job Postings</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/auth/company/candidates" className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl">
                                <Users2 size={20} />
                                <span>Candidates</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/auth/company/settings" className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl">
                                <Settings size={20} />
                                <span>Settings</span>
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Logout Button */}
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl w-full mt-4"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 bg-[#EFF6FF] overflow-y-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#1F479A]">Company Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {company?.pointOfContactFirstName || 'User'}!</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-gray-500 mb-2">Active Job Postings</h3>
                        <p className="text-2xl font-bold">0</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-gray-500 mb-2">Total Applications</h3>
                        <p className="text-2xl font-bold">0</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-gray-500 mb-2">Shortlisted Candidates</h3>
                        <p className="text-2xl font-bold">0</p>
                    </div>
                </div>

                {/* Company Info Section */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold mb-4">Company Information</h2>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-gray-500 mb-1">Industry</p>
                            <p className="font-medium">{company?.industryType || 'Not specified'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-1">Location</p>
                            <p className="font-medium">{company?.headquarterLocation || 'Not specified'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-1">Company Size</p>
                            <p className="font-medium">{company?.companySize || 'Not specified'} employees</p>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-1">Established</p>
                            <p className="font-medium">{company?.yearOfEstablishment || 'Not specified'}</p>
                        </div>
                    </div>
                </div>

                {/* Job Roles and Expertise Section */}
                <div className="grid grid-cols-2 gap-6 mt-6">
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