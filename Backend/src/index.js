
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config({path: '../.env'});

const app = express();
const PORT = process.env.PORT;

// Add CORS middleware
/*app.use(cors({
  origin: "http://localhost:5173", // Replace with your frontend's origin
  credentials: true,
}));*/

// Production CORS settings
/*app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));*/


//app.use(cors({vredentials:true}))

// Development CORS settings
app.use(cors({
    origin: true, // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Enable pre-flight requests for all routes
app.options('*', cors());

app.use(cookieParser(process.env.COOKIE_SECRET));
//app.use(cookieParser());

app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log("server is running on port:" + PORT);
  connectDB();
});