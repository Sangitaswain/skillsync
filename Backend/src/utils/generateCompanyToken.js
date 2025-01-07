import jwt from "jsonwebtoken";

export const generateCompanyTokenAndSetCookie = (res, companyid) => {
    const token = jwt.sign({ companyid }, process.env.JWT_SECRET_COMPANY, {
        expiresIn: "7d",
    });

    res.cookie("companyToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return token;
};