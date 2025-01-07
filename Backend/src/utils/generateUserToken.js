import jwt from "jsonwebtoken";

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
};