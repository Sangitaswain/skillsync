import jwt from "jsonwebtoken";

export const verifyUserToken = (req, res, next) => {
    console.log("Received headers:", req.headers);
    console.log("Received cookies:", req.signedCookies);
    const token = req.signedCookies.usertoken || req.headers.authorization?.split(" ")[1];
    console.log("Received user token:", token);

    if (!token) {
        return res.status(401).json({
            success: false, 
            msg: "Unauthorized - no user token provided"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);
        console.log("Decoded user token:", decoded);

        if (!decoded || !decoded.userid) {
            console.error("Invalid token structure:", decoded);
            return res.status(401).json({
                success: false, 
                msg: "Unauthorized - invalid token structure"
            });
        }

        req.user = {
            userid: decoded.userid
        };
        
        console.log("User ID being searched:", req.user.userid);
        next();

    } catch (error) {
        console.error("Token verification error:", error);
        
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
            msg: "Internal server error"
        });
    }
};