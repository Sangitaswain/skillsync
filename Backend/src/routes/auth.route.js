import express from "express";
import { StudentSignup,verifystudentEmail, resendstudentVerificationOTP, StudentLogin, StudentLogout, studentforgotPassword, studentresetPassword, studentcheckAuth,  CompanySignup ,resendcompanyVerificationOTP,CompanyLogin , CompanyLogout, companyforgotPassword , companyresetPassword, companycheckAuth, verifyCompanyEmail, initiateGoogleAuth,
    handleGoogleCallback} from "../controllers/auth.controller.js";
import { verifyUserToken } from "../middleware/verifyUserToken.js";
import { verifyCompanyToken } from "../middleware/verifyCompanyToken.js";

const router = express.Router();



router.post("/student-signup", StudentSignup);
router.post("/verify-student-email",verifystudentEmail);
router.post("/resend-student-verification-otp", resendstudentVerificationOTP);
router.post("/student-login", StudentLogin);
router.post("/student-logout", StudentLogout);
router.post("/student-forgot-password", studentforgotPassword);
router.post("/student-reset-password/:token", studentresetPassword);
router.get("/student-check-auth", verifyUserToken, studentcheckAuth);


//Add Google OAuth routes
router.get('/google', initiateGoogleAuth);
router.get('/google/callback', handleGoogleCallback);


router.post("/company-signup", CompanySignup);
router.post("/resend-company-verification-otp", resendcompanyVerificationOTP);
router.post("/verify-company-email",verifyCompanyEmail);
router.post("/company-login", CompanyLogin);
router.post("/company-logout", CompanyLogout);
router.post("/company-forgot-password", companyforgotPassword);
router.post("/company-reset-password/:token", companyresetPassword);
router.get("/company-check-auth", verifyCompanyToken, companycheckAuth);

export default router;

