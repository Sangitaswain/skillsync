import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { Link } from 'react-router-dom'
import { ArrowLeft, Building2, GraduationCap } from "lucide-react";
import toast from 'react-hot-toast';

const StudentSignup = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    first_Name: "",
    last_Name: "",
    gender: "",
    date_of_birth: "",
    phone_number: "",
    email: "",
    password: "",
    confirm_Password: "",
    state_of_residence: "",
  });


  const validateForm = () => {
    if (!formData.first_Name || !formData.last_Name || !formData.gender || 
        !formData.date_of_birth || !formData.phone_number || !formData.email || 
        !formData.password || !formData.confirm_Password || !formData.state_of_residence) {
      toast.error("All fields are required");
      return false;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }
  
    const phoneRegex = /^\+?[1-9]\d{9,11}$/;
    if (!phoneRegex.test(formData.phone_number)) {
      toast.error("Invalid phone number format");
      return false;
    }
  
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
  
    if (formData.password !== formData.confirm_Password) {
      toast.error("Passwords don't match");
      return false;
    }
  
    return true;
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Basic form validation
    if (!formData.first_Name || !formData.last_Name || !formData.email || 
        !formData.password || formData.password !== formData.confirm_Password) {
      toast.error("Please fill all fields correctly and ensure passwords match.");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:5005/api/auth/student-signup",
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
  
      if (response.status === 201) {
        toast.success("Account setup successful!");
        navigate("/auth/verify-student-email");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || "Error submitting form. Please try again.");
    }
 };


  return (
    <div className="h-screen w-screen bg-[#EFF6FF] p-3 flex">
        {/* Left Side */}
        <div
            className={`w-[434px] h-full rounded-xl transition-all duration-1000 ease-in-out bg-primary px-6 py-8 flex flex-col justify-end`}
        >
            <div className='flex justify-between items-center'>
                <div className='flex items-center gap-1 -ml-1'>
                    <ArrowLeft size={20} color='white'/>
                    <Link to={"/"}>
                        <p className='text-white'>Back to Home</p>
                    </Link>
                </div>
                <Link to={"/auth/student-login"}>
                    <span className='text-white'>Login?</span>
                </Link>
            </div>

        </div>

        {/* Right Side */}
        <div className="h-full w-full flex flex-col justify-center items-center">
            {/* Button to switch between Student and Company */}
            <div className="bg-white w-[476px] rounded-full shadow-lg p-1 flex gap-1">
                <Link to="/auth/student-signup" >
                    <div
                        className={`w-[232px] justify-center py-4 rounded-full transition-all items-center flex gap-2 duration-500 ease-in-out bg-primary text-white`}
                    >
                        <GraduationCap size={24}/>
                        <p>I'm a Student</p>
                    </div>
                </Link>
                <Link to="/auth/company-signup" >
                    <div
                        className={`w-[232px] justify-center py-4 rounded-full transition-all items-center flex gap-2 duration-500 ease-in-out bg-[#F6F6F6] text-gray-600`}
                    >
                        <Building2 size={20}/>
                        <p>I'm a Company</p>
                    </div>
                </Link>
            </div>

            {/* Student Signup Form */}
            <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit}>
                {/* Name Fields */}
                <div className="flex gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">First Name</label>
                        <input
                            type="text"
                            className="px-4 py-2 rounded-xl border border-[#BCC3D0] w-[232px]"
                            placeholder="John"
                            name="first_Name"
                            value={formData.first_Name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">Last Name</label>
                        <input
                            type="text"
                            className="px-4 py-2 rounded-xl border border-[#BCC3D0] w-[232px]"
                            placeholder="Doe"
                            name="last_Name"
                            value={formData.last_Name}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Email Field */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-600">Email</label>
                    <input
                        type="email"
                        className="px-4 py-2 rounded-xl border border-[#BCC3D0] w-[476px]"
                        placeholder="johndoe@example.com"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </div>

                {/* Phone Number and Date of Birth */}
                <div className="flex gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">Phone Number</label>
                        <input
                            type="text"
                            className="px-4 py-2 rounded-xl border border-[#BCC3D0] w-[232px]"
                            placeholder="+91 1234567890"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">Date of Birth</label>
                        <input
                            type="date"
                            className="px-4 py-2 rounded-xl border border-[#BCC3D0] w-[232px]"
                            placeholder="01-01-2000"
                            name="date_of_birth"
                            value={formData.date_of_birth}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Gender and State of Residence */}
                <div className="flex gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">Gender</label>
                        <select
                            className="px-4 py-2 rounded-xl border border-[#BCC3D0] w-[232px]"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                        >
                            <option value="" disabled>
                                Select gender
                            </option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">State of Residence</label>
                        <select
                            className="px-4 py-2 rounded-xl border border-[#BCC3D0] w-[232px]"
                            name="state_of_residence"
                            value={formData.state_of_residence}
                            onChange={handleInputChange}
                        >
                            <option value="" disabled>
                                Select state
                            </option>
                            {/* Add other state options */}
                            <option value="andaman-nicobar">Andaman and Nicobar Islands</option>
                                <option value="andhra-pradesh">Andhra Pradesh</option>
                                <option value="arunachal-pradesh">Arunachal Pradesh</option>
                                <option value="assam">Assam</option>
                                <option value="bihar">Bihar</option>
                                <option value="chandigarh">Chandigarh</option>
                                <option value="chhattisgarh">Chhattisgarh</option>
                                <option value="dadra-nagar-haveli-daman-diu">Dadra and Nagar Haveli and Daman and Diu</option>
                                <option value="delhi">Delhi</option>
                                <option value="goa">Goa</option>
                                <option value="gujarat">Gujarat</option>
                                <option value="haryana">Haryana</option>
                                <option value="himachal-pradesh">Himachal Pradesh</option>
                                <option value="jammu-kashmir">Jammu and Kashmir</option>
                                <option value="jharkhand">Jharkhand</option>
                                <option value="karnataka">Karnataka</option>
                                <option value="kerala">Kerala</option>
                                <option value="ladakh">Ladakh</option>
                                <option value="lakshadweep">Lakshadweep</option>
                                <option value="madhya-pradesh">Madhya Pradesh</option>
                                <option value="maharashtra">Maharashtra</option>
                                <option value="manipur">Manipur</option>
                                <option value="meghalaya">Meghalaya</option>
                                <option value="mizoram">Mizoram</option>
                                <option value="nagaland">Nagaland</option>
                                <option value="odisha">Odisha</option>
                                <option value="puducherry">Puducherry</option>
                                <option value="punjab">Punjab</option>
                                <option value="rajasthan">Rajasthan</option>
                                <option value="sikkim">Sikkim</option>
                                <option value="tamil-nadu">Tamil Nadu</option>
                                <option value="telangana">Telangana</option>
                                <option value="tripura">Tripura</option>
                                <option value="uttar-pradesh">Uttar Pradesh</option>
                                <option value="uttarakhand">Uttarakhand</option>
                                <option value="west-bengal">West Bengal</option>

                        </select>
                    </div>
                </div>

                {/* Password Fields */}
                <div className="flex gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">Password</label>
                        <input
                            type="password"
                            className="px-4 py-2 rounded-xl border border-[#BCC3D0] w-[232px]"
                            placeholder="••••••••"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">Confirm Password</label>
                        <input
                            type="password"
                            className="px-4 py-2 rounded-xl border border-[#BCC3D0] w-[232px]"
                            placeholder="••••••••"
                            name="confirm_Password"
                            value={formData.confirm_Password}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <button className="w-[476px] bg-primary rounded-xl py-2.5 text-white mt-4">
                    Sign Up
                </button>
            </form>
        </div>
    </div>
);
};

export default StudentSignup;