// index.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import session from "express-session";
import passport from "passport";
import { initializeGoogleStrategy } from "./utils/passport.js";

dotenv.config({path: '../.env'});

const app = express();
const PORT = process.env.PORT;

// CORS first
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
}));

// Cookie parser before session
app.use(cookieParser(process.env.COOKIE_SECRET));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: 'sessionId',
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax',
        path: '/'
    }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Initialize Google Strategy
initializeGoogleStrategy();

app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log("server is running on port:" + PORT);
    connectDB();
});