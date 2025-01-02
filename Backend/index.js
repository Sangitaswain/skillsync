import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDB } from "./db/connectDB.js";

import authRoutes from "./routes/auth.route.js";

dotenv.config();
dotenv.config({ path: './Backend/.env' });

console.log("MONGO_URI:", process.env.MONGO_URI); // Debug statement
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());//middleware to parse json data
app.use(cookieParser());//allows us to set and get cookies


app.get("/", (req, res) => {
    res.send("Welcome to the API!");
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
    });