
import Company from "../models/company.model.js";

import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail, sendResetPasswordEmail , sendPasswordResetSuccessEmail} from "../mailtrap/emails.js";



export const signup = async (req, res) => {
    console.log("Received signup request");

    const { CompanyName, CompanyAdress, CompanyEmail, Password, ConfirmPassword, IndustryType, WhereisyourHeadquarterlocated, CompanySize, YearofEstablishment, FirstName, LastName, Designation, Email, PhoneNumber, TypicalRoles, AreasofExpertiseSought, Companylogo, CompanyWebsite, LinkedinProfile } = req.body;

    try{
        console.log("Request body:", req.body);
        if(!CompanyName || !CompanyAdress || !CompanyEmail || !Password || !ConfirmPassword || !IndustryType || !WhereisyourHeadquarterlocated || !CompanySize || !YearofEstablishment || !FirstName || !LastName || !Designation || !Email || !PhoneNumber || !TypicalRoles || !AreasofExpertiseSought){
            return res.status(400).json({msg: "All fields are required"});
        }

        
        if(Password !== ConfirmPassword) {
            return res.status(400).json({
                success: false, 
                msg: "Passwords do not match"
            });
        }

        const companyAlreadyExists = await Company.findOne({CompanyEmail});
        if(companyAlreadyExists){
            return res.status(400).json({success:false, msg: "Company already exists"});
        }

        const hashedPassword = await bcryptjs.hash(Password, 10);
        const hashedConfirmPassword = await bcryptjs.hash(ConfirmPassword, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const company = new Company({
            CompanyName, CompanyAdress, CompanyEmail, Password: hashedPassword, ConfirmPassword: hashedPassword, IndustryType, WhereisyourHeadquarterlocated, CompanySize, YearofEstablishment, FirstName, LastName, Designation, Email, PhoneNumber, TypicalRoles, AreasofExpertiseSought, Companylogo, CompanyWebsite, LinkedinProfile, 
            verificationToken,
            verificationTokenExpire: Date.now() + 24 * 60 * 60 *1000
        }) 

        await company.save();


        //jwt 
        generateTokenAndSetCookie(res,company._id);

        await sendVerificationEmail(company.Email, company.verificationToken);
        await sendWelcomeEmail(company.Email, company.CompanyName, company.FirstName, company.Email);

        res.status(201).json({success:true, msg: "Company created successfully",
            company: {
                ...company._doc,
                Password: undefined,
                ConfirmPassword: undefined,
            }
        });

    }catch(error){
        res.status(400).json({success:false, msg: error.message});
    }
};

export const verifyEmail = async (req, res) => {
    const{code} = req.body;
    try{
        const company = await Company.findOne({verificationToken: code, verificationTokenExpire: {$gt: Date.now()}});
        if(!company){
            return res.status(400).json({success:false, msg: "Invalid or expired verification code"});
        }
        company.isVerified = true;
        company.verificationToken = undefined;
        company.verificationTokenExpire = undefined;
        await company.save();

        await sendWelcomeEmail(company.CompanyEmail, company.CompanyName, company.Email, company.FirstName);

        res.status(200).json({success:true, msg: "Email verified successfully",
            company: {
                ...company._doc,
                Password: undefined,
            }
        });

    }catch(error){
        console.log(("error in verifyingEmail",error));
        res.status(400).json({success:false, msg: "Server error"});
    }
};

export const login = async (req, res) => {
    const {CompanyEmail, Password} = req.body;
    try {
        const company = await Company.findOne({CompanyEmail});
        if(!company){
            return res.status(400).json({success:false, msg: "Invalid credentials"});
        }
        const isPasswordValid = await bcryptjs.compare(Password, company.Password);
        if(!isPasswordValid){
            return res.status(400).json({success:false, msg: "Invalid credentials"});
        }

        generateTokenAndSetCookie(res, company._id);

        company.lastLogin = new Date();
        await company.save();

        res.status(200).json({
            sucess:true,
            msg: "Logged in successfully",
            company: {
                ...company._doc,
                Password: undefined,
                ConfirmPassword: undefined,
            },
        })

        


    }catch(error){
        console.log("Error in login", error);
        res.status(400).json({success:false, msg: error.message});
    }
    
};

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({success:true, msg: "Logged out successfully"});  
};

export const forgotPassword = async (req, res) => {
    const {CompanyEmail} = req.body;
    console.log("Received forgot password request for email:", CompanyEmail); 
    try{
        const company = await Company.findOne({CompanyEmail});
        console.log("Company found:", company); 
        

        if(!company){
            return res.status(400).json({success:false, msg: "Company not found"});
        }
        //generate reset password token

        const resetToken = crypto.randomBytes(20).toString("hex");
        const restTokenExpire = Date.now() + 10 * 60 * 1000; //10 minutes

        company.resetPasswordToken = resetToken;
        company.resetPasswordExpire = restTokenExpire;

        await company.save();

        //send email
        await sendResetPasswordEmail(company.CompanyEmail, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        res.status(200).json({success:true, msg: "Reset password email sent successfully"});

    }catch(error){
        console.log("Error in forgot password", error);
        res.status(400).json({success:false, msg: error.message});
    }
};

export const resetPassword = async (req, res) => {
    try {
        const {token} = req.params;
        const {Password} = req.body;

        const company = await Company.findOne({resetPasswordToken: token,
            resetPasswordExpire: {$gt: Date.now()}
        });

        if(!company){
            return res.status(400).json({success:false, msg: "Invalid or expired reset token"});
        }

        //update the password
        const hashedPassword = await bcryptjs.hash(Password, 10);
        company.Password = hashedPassword;
        company.resetPasswordToken = undefined;
        company.resetPasswordExpire = undefined;
        await company.save();

        await sendPasswordResetSuccessEmail(company.CompanyEmail);

        res.status(200).json({success:true, msg: "Password reset successfully"});
    }catch(error){
        console.log("Error in reset password", error);
        res.status(400).json({success:false, msg: error.message});
    }
};


export const checkAuth = async (req, res) => {
    try{
        const company = await Company.findById(req.companyId).select("-Password");
        if(!company){
            return res.status(400).json({success:false, msg: "Company not found"});
        }

        res.status(200).json({success: true, company});


    }catch(error){
        console.log("Error in checkAuth", error);
        res.status(400).json({success:false, msg: error.message});
    }
};  


