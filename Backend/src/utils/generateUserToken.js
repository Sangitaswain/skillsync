/*import jwt from "jsonwebtoken";

export const generateUserTokenAndSetCookie = (res, userid) => {
    const token = jwt.sign({ userid }, process.env.JWT_SECRET_USER, {
        expiresIn: "7d",
    });

    res.cookie("userToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return token;
};*/

/*import jwt from "jsonwebtoken";

export const generateUserTokenAndSetCookie = (res, userid) => {
    const token = jwt.sign({ userid }, process.env.JWT_SECRET_USER, {
        expiresIn: "7d",
    });

    res.cookie("userToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return token;
};*/

import jwt from "jsonwebtoken";

export const generateUserTokenAndSetCookie = (res, userid) => {
    const token = jwt.sign({ userid }, process.env.JWT_SECRET_USER, {
        expiresIn: "15d",
    });

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 24 * 60 * 60 * 1000,
        path: "/",
        signed: true,
    };

    if (process.env.NODE_ENV === "development") {
        cookieOptions.secure = false;
        cookieOptions.sameSite = "lax";
    }

    res.cookie("usertoken", token, cookieOptions);
    return token;
};