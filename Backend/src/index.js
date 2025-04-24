import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import session from "express-session";
import passport from "passport";
import { initializeGoogleStrategy } from "./utils/passport.js";
import { initializeMicrosoftStrategy } from "./utils/microsoftpassport.js";
import MongoStore from 'connect-mongo';

dotenv.config({path: '../.env'});

const app = express();
const PORT = process.env.PORT;

// CORS configuration
// In index.js
// In index.js

// Development-specific CORS configuration
const corsOptions = {
    origin: 'http://localhost:5173', // Vite's default port
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
};

app.use(cors(corsOptions));

// Essential middleware setup for development
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// Development session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions'
    }),
    cookie: {
        secure: false, // Important for development
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(passport.initialize());
app.use(passport.session());

initializeGoogleStrategy();
initializeMicrosoftStrategy();

app.use(express.json());
app.use("/api/auth", authRoutes);


app.listen(PORT, () => {
    console.log("Server running on port:" + PORT);
    connectDB();
});