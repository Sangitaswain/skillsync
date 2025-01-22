/*import jwt from "jsonwebtoken";

export const generateCompanyTokenAndSetCookie = (res, companyid) => {
    const token = jwt.sign({ companyid }, process.env.JWT_SECRET_COMPANY, {
        expiresIn: "7d",
        });
    
        return token;
    };

    res.cookie("companyToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return token;
};*/


import jwt from "jsonwebtoken";

export const generateCompanyTokenAndSetCookie = (res, companyid) => {
    const token = jwt.sign({ companyid }, process.env.JWT_SECRET_COMPANY, {
        expiresIn: "15d",
    });



  /*  res.cookie("companytoken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? "none" : "strict",
        sameSite: "strict",
        maxAge: 15 * 24 * 60 * 60 * 1000,
    });
};
*/















    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 24 * 60 * 60 * 1000,
        path: "/",
        signed: true,
    };

    // Only modify for development
    if (process.env.NODE_ENV === "development") {
        cookieOptions.secure = false;
        cookieOptions.sameSite = "lax";
    }

    res.cookie("companytoken", token, cookieOptions);
    return token;
}; 
