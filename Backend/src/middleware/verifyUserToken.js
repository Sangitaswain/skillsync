


import jwt from "jsonwebtoken";

export const verifyUserToken = (req, res, next) => {
    console.log("Received headers:", req.headers);
    console.log("Received cookies:", req.cookies);
    const token = req.cookies.userToken || req.headers.authorization?.split(" ")[1];
    console.log("Received user token:", token);

    if(!token){
        return res.status(401).json({success:false, msg: "Unauthorized - no user token provided"})
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);
        console.log("Decoded user token:", decoded);

        if(!decoded){
            return res.status(401).json({success:false, msg: "Unauthorized - user token verification failed"})
        }

        req.user = decoded;
        console.log("User ID being searched:", req.user.userid); 
        next();
    }catch(error){
        console.log("Error in verifyUserToken", error);
        return res.status(500).json({success:false, msg: error.message});
    }
};