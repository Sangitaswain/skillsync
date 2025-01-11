// Import JSON Web Token library for token verification
import jwt from "jsonwebtoken";

/**
 * Middleware function to verify company authentication tokens
 * This function checks for valid JWT tokens in either cookies or authorization header
 */
export const verifyCompanyToken = (req, res, next) => {
    // Log incoming request headers and signed cookies for debugging
    console.log("Received headers:", req.headers);
    console.log("Received cookies:", req.signedCookies);

    // Extract token from either signed cookies or authorization header
    const token = req.signedCookies.companyToken || req.headers.authorization?.split(" ")[1];
    console.log("Received company token:", token);

    // Check if token exists, return error if not found
    if (!token) {
        return res.status(401).json({
            success: false, 
            msg: "Unauthorized - no company token provided"
        });
    }

    try {
        // Verify the token using company-specific secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET_COMPANY);
        console.log("Decoded company token:", decoded);

        // Ensure token contains required company ID
        if (!decoded || !decoded.companyid) {
            console.error("Invalid token structure:", decoded);
            return res.status(401).json({
                success: false, 
                msg: "Unauthorized - invalid token structure"
            });
        }

        // Add company ID to request object for use in subsequent middleware/routes
        req.company = {
            companyid: decoded.companyid  // Only pass the necessary data
        };
        
        console.log("Company ID being searched:", req.company.companyid);
        next(); // Proceed to next middleware/route handler

    } catch (error) {
        // Log any token verification errors
        console.error("Token verification error:", error);
        
        // Handle specific JWT error types with appropriate responses
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                msg: "Invalid token"
            });
        }
        
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                success: false,
                msg: "Token expired"
            });
        }

        // Generic error response for unexpected errors
        return res.status(500).json({
            success: false,
            msg: "Authentication error"
        });
    }
};







/*import jwt from "jsonwebtoken";

export const verifyCompanyToken = (req, res, next) => {
    console.log("Received headers:", req.headers);
    console.log("Received cookies:", req.signedcookies);
    const token = req.signedcookies.companyToken || req.headers.authorization?.split(" ")[1];
    console.log("Received company token:", token);

    if(!token){
        return res.status(401).json({success:false, msg: "Unauthorized - no company token provided"})
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET_COMPANY);
        console.log("Decoded company token:", decoded);

        if(!decoded || !decoded.companyid){
            console.error("Decoded token:", decoded);
            return res.status(401).json({success:false, msg: "Unauthorized - company token verification failed"})
        }

        req.company = decoded;
        console.log("Company ID being searched:", req.company.companyid); 
        next();
    }catch(error){
        console.log("Error in verifyCompanyToken", error);
        return res.status(500).json({success:false, msg: error.message});
    }
};*/

