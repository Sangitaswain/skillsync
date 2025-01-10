import jwt from "jsonwebtoken";

export const verifyCompanyToken = (req, res, next) => {
    console.log("Received headers:", req.headers);
    console.log("Received cookies:", req.signedCookies);  // Changed to signedCookies
    
    const token = req.signedCookies.companyToken || req.headers.authorization?.split(" ")[1];
    console.log("Received company token:", token);

    if (!token) {
        return res.status(401).json({
            success: false, 
            msg: "Unauthorized - no company token provided"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_COMPANY);
        console.log("Decoded company token:", decoded);

        if (!decoded || !decoded.companyid) {
            console.error("Invalid token structure:", decoded);
            return res.status(401).json({
                success: false, 
                msg: "Unauthorized - invalid token structure"
            });
        }

        req.company = {
            companyid: decoded.companyid  // Only pass the necessary data
        };
        
        console.log("Company ID being searched:", req.company.companyid);
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        
        // More specific error responses
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

