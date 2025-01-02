import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, companyid) => {
    const token = jwt.sign({ companyid }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("token", token, {
        httpOnly: true, //XSS attack
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", //csrf
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    });


    return token;
};

/*import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
    // Ensure the secret key exists
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined in your environment variables");
    }

    // Generate JWT
    const token = jwt.sign({ userId }, secret, { expiresIn: "7d" });

    // Set the cookie
    res.cookie("token", token, {
        httpOnly: true, // Prevent access via client-side scripts
        secure: process.env.NODE_ENV === "production", // Enable in production
        sameSite: "strict", // CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};*/
