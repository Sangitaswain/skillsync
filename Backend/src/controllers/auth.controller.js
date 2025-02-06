// Import required models for database operations
import Company from "../models/company.model.js";
import User from "../models/user.model.js"

// Import libraries for password hashing and token generation
import bcryptjs from "bcryptjs";
import crypto from "crypto";

// Import utility functions for token generation and email sending
import { generateUserTokenAndSetCookie } from "../utils/generateUserToken.js";
import { generateCompanyTokenAndSetCookie } from "../utils/generateCompanyToken.js";
//import { sendUserVerificationEmail, sendUserWelcomeEmail, sendUserPasswordResetEmail, sendUserPasswordResetSuccessEmail, sendCompanyVerificationEmail, sendCompanyWelcomeEmail, sendCompanyPasswordResetEmail, sendCompanyPasswordResetSuccessEmail  } from "../mailtrap/emails.js";
import transporter from "../../nodemailer/nodemailer.config.js";
import passport from 'passport';



// Student Authentication Controllers

// Handle student registration
export const StudentSignup = async (req, res) => {
    const { first_Name, last_Name, gender, date_of_birth, phone_number, email, password, confirm_Password, state_of_residence } = req.body;
    try{
        // Validate input data
        if (password !== confirm_Password) {
            return res.status(400).json({ message: "Password and Confirm Password must match" });
        }
        if (phone_number.length < 10 || phone_number.length > 15) {
            return res.status(400).json({ message: "Invalid phone number" });
        }
        if(!first_Name || !last_Name || !gender || !date_of_birth || !phone_number || !email || !password || !confirm_Password || !state_of_residence){
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6){
            return res.status(400).json({ message: "password must be at least 6 characters" });
        }

        // Check if user already exists
        const userAlreadyExists = await User.findOne({email});

        if (userAlreadyExists) return res.status(400).json({message: "Email already exist" });

        // Hash password and create verification token
        const salt =  await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password,salt);

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        // Create new user in database
        const newUser = new User({
            first_Name,
            last_Name,
            gender,
            date_of_birth,
            phone_number,
            email,
            password:hashedPassword,
            confirm_Password:hashedPassword,
            state_of_residence,
            verificationToken,
            verificationTokenExpire: Date.now() + 24 * 60 * 60 * 1000
        });
        await newUser.save();

        // send welcome email
        const welcomeMailOptions = {
            from: process.env.SENDER_EMAIL,
            to: newUser.email,
            subject: 'Welcome to SkillSync!',
            text: `Hello ${newUser.first_Name},\n\nWelcome to SkillSync! We're excited to have you join our platform.\n\nAt SkillSync, we're dedicated to helping students like you find the perfect job.\n\nTo get started, please verify your email address using the verification code we've sent in a separate email.\n\nBest regards,\nSkillSync Team`
        };

        // Send OTP email
        const otpMailOptions = {
            from: process.env.SENDER_EMAIL,
            to: newUser.email,
            subject: 'SkillSync - Email Verification Code',
            text: `Hello ${newUser.first_Name},\n\nYour verification code is ${verificationToken}\n\n
            This code will expire in 24 hours.\n\nIf you did not request this code, please ignore this email.\n\nBest regards,\nSkillSync Team`
        };

        // Send both emails
        await Promise.all([
            transporter.sendMail(welcomeMailOptions),
            transporter.sendMail(otpMailOptions)
        ]);

        // Generate JWT and send verification emails
        generateUserTokenAndSetCookie(res,newUser._id);

      

        res.status(201).json({ success: true, user :newUser ,message: "User created successfully",
            newUser: {
                ...newUser._doc,
            _id:newUser._id,
            password: undefined,
            confirm_Password: undefined,
            verificationToken: undefined
            }
            
        });

    }catch(error){
        res.status(400).json({success:false, msg: error.message});
    }
};




// Verify student email address
export const verifystudentEmail = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ success: false, msg: "Verification code is required" });
        }
        const user = await User.findOne({ verificationToken: code, verificationTokenExpire: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ success: false, msg: "Invalid or expired verification code" });
        }
        // Update user document
   
        // Update user verification status
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpire = undefined;
        await user.save();

        const verificationSuccessEmail = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'SkillSync - Account Verified Successfully',
            text: `Your email address has been verified successfully. You can now login to your SkillSync
            account and start exploring job opportunities.`
        };

        await transporter.sendMail(verificationSuccessEmail);
        res.status(200).json({
            success: true, msg: "Email verified successfully",
        });
        } catch (error) {
            console.error("Verification error:", error);
            res.status(500).json({
                success: false,
                msg: "Verification failed"
            });
        }
    };




// Resend OTP if needed
export const resendstudentVerificationOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const newUser = await User.findOne({ email });
        if (!newUser) {
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
            }
        const newToken = Math.floor(100000 + Math.random() * 900000).toString();
        newUser.verificationToken = newToken;
        newUser.verificationTokenExpire = Date.now() + 2 * 60 * 1000;
        await newUser.save();
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: newUser.email,
            subject: 'SkillSync - New Verification OTP',
            text: `Hello ${newUser.first_Name},\n\nYour new verification OTP is: ${newToken}\n\n
            This OTP will expire in 2 minutes.\n\nBest regards,\nSkillSync Team`
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({
            success: true,
            msg: "New verification OTP sent successfully"
        });
    } catch (error) {
        console.error("Resend OTP error:", error);
        res.status(400).json({
            success: false,
            msg: "Failed to resend OTP"
        });
    }
};

// Handle student login
export const StudentLogin = async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, msg: "All fields are required" });
        }
    console.log("Received login request for email:", {email});
    try {
        // Find user and verify password
        const newUser = await User.findOne({email}).select("+password");
        if(!newUser){
            return res.status(400).json({success:false, msg: "Invalid credentials"});
        }
        const isPasswordValid = await bcryptjs.compare(password, newUser.password);
        if(!isPasswordValid){
            return res.status(400).json({success:false, msg: "Invalid credentials"});
        }

        // Generate token and update last login
        generateUserTokenAndSetCookie(res, newUser._id);

        newUser.lastLogin = new Date();
        await newUser.save();

        res.status(200).json({
            success:true,
            msg: "Logged in successfully",
            newUser: {
                ...newUser._doc,
                isVerified: newUser.isVerified,
                password: undefined,
                confirm_Password: undefined,
            },
        })

    }catch(error){
        console.log("Error in login", error);
        res.status(400).json({success:false, msg: error.message});
    }
};





// Handle student logout
export const StudentLogout = async (req, res) => {
    res.clearCookie("usertoken");
    res.status(200).json({success:true, msg: "Logged out successfully"});  
};




// Handle student forgot password request
export const studentforgotPassword = async (req, res) => {
    const {email} = req.body;
    try {
        const newUser = await User.findOne({email});
        
        if(!newUser) {
            return res.status(404).json({success: false, msg: "User not found"});
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpire = Date.now() + 10 * 60 * 1000;

        newUser.resetPasswordToken = resetToken;
        newUser.resetPasswordExpire = resetTokenExpire;
        await newUser.save();

        const resetLink = `${process.env.CLIENT_URL}/auth/student-reset-password/${resetToken}`;

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: newUser.email,
            subject: 'SkillSync - Reset Password',
            text: `Hello ${newUser.first_Name},\n\nClick the following link to reset your password:\n${resetLink}\n\n
            Best regards,\nSkillSync Team`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({success: true, msg: "Reset password email sent successfully"});
    } catch(error) {
        console.log("Error in forgot password", error);
        res.status(500).json({success: false, msg: error.message});
    }
};
        
   




// Handle student password reset
export const studentresetPassword = async (req, res) => {
    try {
        const {token} = req.params;
        const {password} = req.body;

        if (!password) {
            return res.status(400).json({success:false, msg: "Password is required"});
        }
        // Find user by reset token
        const newUser = await User.findOne({resetPasswordToken: token,
            resetPasswordExpire: {$gt: Date.now()}
        });

        if(!newUser){
            return res.status(400).json({success:false, msg: "Invalid or expired reset token"});
        }

        // Update password and clear reset token
        const hashedPassword = await bcryptjs.hash(password, 10);
        newUser.password = hashedPassword;
        newUser.confirm_Password = hashedPassword;
        newUser.resetPasswordToken = undefined;
        newUser.resetPasswordExpire = undefined;
        await newUser.save();

        // Send success email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: newUser.email,
            subject: 'SkillSync - Password Reset',
            text: `Hello ${newUser.first_Name},\n\nYour password has been reset successfully
            If you did not make this change, please contact support immediately.\n\nBest regards,\nSkillSync Team`
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({success:true, msg: "Password reset successfully"});
    }
    catch(error){
        console.log("Error in reset password", error);
        res.status(400).json({success:false, msg: error.message});
    }
    };





// Check student authentication status
export const studentcheckAuth = async (req, res) => {
    try{
        const newUser = await User.findById(req.user.userid).select("-password");
        if(!newUser){
            return res.status(400).json({success:false, msg: "User not found"});
        }

        res.status(200).json({success: true,  newUser});

    }catch(error){
        console.log("Error in checkAuth", error);
        res.status(400).json({success:false, msg: error.message});
    }
};  








// Company Authentication Controllers

// Handle company registration
// Company Signup Controller
export const CompanySignup = async (req, res) => {
    const { 
        companyName, companyPhoneNumber, companyEmail, 
        password, confirmPassword, industryType, 
        headquarterLocation, companySize, yearOfEstablishment,
        pointOfContactFirstName, pointOfContactLastName,
        pointOfContactDesignation, pointOfContactEmail,
        pointOfContactPhoneNumber, jobRoles,
        areasOfExpertiseSought, companyWebsite, linkedInProfile 
    } = req.body;

    try {
        // Basic validation
        if (!companyName || !companyPhoneNumber || !companyEmail || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        // Check if company exists
        const companyExists = await Company.findOne({ companyEmail });
        if (companyExists) {
            return res.status(400).json({ 
                success: false, 
                message: "Company already registered" 
            });
        }

        // Generate verification OTP
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Parse JSON fields
        const parsedJobRoles = JSON.parse(jobRoles);
        const parsedExpertise = JSON.parse(areasOfExpertiseSought);

        // Create new company
        const company = new Company({
            companyName,
            companyPhoneNumber,
            companyEmail,
            password: hashedPassword,
            confirmPassword: hashedPassword,
            industryType,
            headquarterLocation,
            companySize,
            yearOfEstablishment,
            pointOfContactFirstName,
            pointOfContactLastName,
            pointOfContactDesignation,
            pointOfContactEmail,
            pointOfContactPhoneNumber,
            jobRoles: parsedJobRoles,
            areasOfExpertiseSought: parsedExpertise,
            companyWebsite,
            linkedInProfile,
            verificationToken,
            verificationTokenExpire: Date.now() + 10 * 60 * 1000, // 10 minutes expiry
        });

        await company.save();

        // Send welcome email
        const welcomeMailOptions = {
            from: process.env.SENDER_EMAIL,
            to: company.companyEmail,
            subject: 'Welcome to SkillSync!',
            text: `Dear ${company.companyName},\n\n` +
                  `Welcome to SkillSync! We're excited to have you join our platform.\n\n` +
                  `At SkillSync, we're dedicated to helping companies like yours find the perfect talent.\n\n` +
                  `To get started, please verify your email address using the verification code we've sent in a separate email.\n\n` +
                  `Best regards,\nSkillSync Team`
        };

        // Send OTP email
        const otpMailOptions = {
            from: process.env.SENDER_EMAIL,
            to: company.companyEmail,
            subject: 'SkillSync - Email Verification Code',
            text: `Dear ${company.companyName},\n\n` +
                  `Your email verification code is: ${verificationToken}\n\n` +
                  `This code will expire in 10 minutes.\n\n` +
                  `If you did not request this code, please ignore this email.\n\n` +
                  `Best regards,\nSkillSync Team`
        };

        // Send both emails
        await Promise.all([
            transporter.sendMail(welcomeMailOptions),
            transporter.sendMail(otpMailOptions)
        ]);

        // Set authentication token
        generateCompanyTokenAndSetCookie(res, company._id);

        // Return success without sensitive data
        res.status(201).json({
            success: true,
            message: "Company registered successfully. Please check your email for verification code.",
            company: {
                ...company._doc,
                password: undefined,
                confirmPassword: undefined,
                verificationToken: undefined
            }
        });

    } catch(error) {
        console.error("Signup error:", error);
        res.status(400).json({ 
            success: false, 
            message: error.message || "Registration failed" 
        });
    }
};

// Verify Company Email
export const verifyCompanyEmail = async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Verification code is required"
            });
        }

        // Find company with valid token
        const company = await Company.findOne({ 
            verificationToken: code,
            verificationTokenExpire: { $gt: Date.now() }
        });

        if (!company) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code"
            });
        }

        // Update verification status
        company.isVerified = true;
        company.verificationToken = undefined;
        company.verificationTokenExpire = undefined;
        await company.save();

        // Send verification success email
        const verificationSuccessEmail = {
            from: process.env.SENDER_EMAIL,
            to: company.companyEmail,
            subject: 'SkillSync - Account Verified Successfully',
            text: `Dear ${company.companyName},\n\n` +
                  `Your email has been successfully verified!\n\n` +
                  `You now have full access to all SkillSync features. Get started by:\n` +
                  `- Completing your company profile\n` +
                  `- Posting your first job\n` +
                  `- Exploring available talent\n\n` +
                  `If you need any assistance, our support team is here to help.\n\n` +
                  `Best regards,\nSkillSync Team`
        };

        await transporter.sendMail(verificationSuccessEmail);

        res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });

    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({
            success: false,
            message: "Verification failed"
        });
    }
};




// Resend OTP if needed
export const resendcompanyVerificationOTP = async (req, res) => {
    try {
        const { companyEmail } = req.body;

        const company = await Company.findOne({ companyEmail });
        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        // Generate new OTP
        const newToken = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Update company with new token
        company.verificationToken = newToken;
        company.verificationTokenExpire = Date.now() + 2 * 60 * 1000;
        await company.save();

        // Send new OTP email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: company.companyEmail,
            subject: 'SkillSync - New Verification OTP',
            text: `Dear ${company.companyName},\n\n` +
                  `Your new verification OTP is: ${newToken}\n\n` +
                  `This OTP will expire in 2 minutes.\n\n` +
                  `Best regards,\nSkillSync Team`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: "New verification OTP sent successfully"
        });

    } catch (error) {
        console.error("Resend OTP error:", error);
        res.status(400).json({
            success: false,
            message: "Failed to resend OTP"
        });
    }
};

// Handle company login
export const CompanyLogin = async (req, res) => {
    const {companyEmail, password} = req.body;
    if (!companyEmail || !password) {
        return res.status(400).json({ success: false, msg: "All fields are required" });
        }
    console.log("Received login request for email:", {companyEmail});
    try {
        // Find company and verify password
        const company = await Company.findOne({companyEmail}).select("+password");
        console.log("Company found:", company);
        if(!company){
            return res.status(400).json({success:false, msg: "Invalid credentials"});
        }
        const isPasswordValid = await bcryptjs.compare(password, company.password);
        if(!isPasswordValid){
            return res.status(400).json({success:false, msg: "Invalid credentials"});
        }

        // Generate token and update last login
        generateCompanyTokenAndSetCookie(res, company._id);

        company.lastLogin = new Date();
        await company.save();

        res.status(200).json({
            success:true,
            msg: "Logged in successfully",
            company: {
                ...company._doc,
                password: undefined,
                confirmPassword: undefined,
            },
        })

    }catch(error){
        console.log("Error in login", error);
        res.status(400).json({success:false, msg: error.message});
    }
};





// Handle company logout
export const CompanyLogout = async (req, res) => {
  
    res.clearCookie("companytoken");
    res.status(200).json({success:true, msg: "Logged out successfully"});  
};


// Handle company forgot password request
export const companyforgotPassword = async (req, res) => {
    const { companyEmail } = req.body;
    console.log("Received forgot password request for email:", companyEmail); 
    try {
        // Find company by email
        const company = await Company.findOne({ companyEmail });
        console.log("Company found:", company); 
        
        if (!company) {
            return res.status(400).json({ success: false, msg: "Company not found" });
        }
        // Generate reset token valid for 10 minutes
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpire = Date.now() + 10 * 60 * 1000;

        company.resetPasswordToken = resetToken;
        company.resetPasswordExpire = resetTokenExpire;

        await company.save();

        // Modified reset link to ensure proper URL construction
        const resetLink = `${process.env.CLIENT_URL}/auth/company-reset-password/${resetToken}`;  // Modified this line
        
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: company.companyEmail,
            subject: 'SkillSync - Reset Password',
            text: `Dear ${company.companyName},\n\n` +
                  `Click the following link to reset your password:\n` +
                  `${resetLink}\n\n` +
                  `This link will expire in 10 minutes.\n\n` +
                  `If you did not request this, please ignore this email.\n\n` +
                  `Best regards,\nSkillSync Team`
        };

        console.log("Sending reset password email with link:", resetLink); // Add this for debugging
        
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, msg: "Reset password email sent successfully" });

    } catch (error) {
        console.log("Error in forgot password", error);
        res.status(400).json({ success: false, msg: error.message });
    }
};



// Handle company password reset
export const companyresetPassword = async (req, res) => {
    try {
        const {token} = req.params;
        const {password} = req.body;

        if (!password) {
            return res.status(400).json({
                success: false, 
                msg: "Password is required"
            });
        }

        const company = await Company.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: {$gt: Date.now()}
        });

        if(!company){
            return res.status(400).json({
                success: false, 
                msg: "Invalid or expired reset token"
            });
        }

        // Update password and clear reset token
        const hashedPassword = await bcryptjs.hash(password, 10);
        company.password = hashedPassword;
        company.confirmPassword = hashedPassword; // Add this if you store confirmPassword
        company.resetPasswordToken = undefined;
        company.resetPasswordExpire = undefined;
        await company.save();

        // Send success email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: company.companyEmail,
            subject: 'SkillSync - Password Reset Successful',
            text: `Dear ${company.companyName},\n\n` +
                  `Your password has been successfully reset.\n\n` +
                  `If you did not make this change, please contact support immediately.\n\n` +
                  `Best regards,\nSkillSync Team`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true, 
            msg: "Password reset successfully"
        });
    } catch(error) {
        console.error("Error in reset password:", error);
        res.status(400).json({
            success: false, 
            msg: "Failed to reset password"
        });
    }
};


// Check company authentication status
export const companycheckAuth = async (req, res) => {
    try{
        // Find company by ID and verify existence
        const company = await Company.findById(req.company.companyid).select("-password");
        if(!company){
            return res.status(400).json({success:false, msg: "Company not found"});
        }

        res.status(200).json({success: true, company});

    }catch(error){
        console.log("Error in checkAuth", error);
        res.status(400).json({success:false, msg: error.message});
    }
};


// Add these to auth.controller.js



// Initiate Google OAuth
export const initiateGoogleAuth = passport.authenticate('google', {
    scope: ['email', 'profile']
});

// Handle Google OAuth callback
export const handleGoogleCallback = (req, res, next) => {
    passport.authenticate('google', {
        failureRedirect: `${process.env.CLIENT_URL}/auth/student-login?error=google_auth_failed`
    })(req, res, async () => {
        try {
            const user = req.user;
            
            // Generate token and set cookie
            generateUserTokenAndSetCookie(res, user._id);

            // Log success and redirect
            console.log('Google authentication successful for:', user.email);
            res.redirect(`${process.env.CLIENT_URL}/auth/student-dashboard`);
        } catch (error) {
            console.error('Google callback error:', error);
            res.redirect(`${process.env.CLIENT_URL}/auth/student-login?error=auth_failed`);
        }
    });
};

