
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Add CORS middleware
app.use(cors({
  origin: "http://localhost:5173", // Replace with your frontend's origin
  credentials: true,
}));

app.use(cookieParser());

app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log("server is running on port:" + PORT);
  connectDB();
});