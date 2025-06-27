// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";
import protectedRoutes from "./routes/protected.js";
import resumeRoutes from "./routes/resume.js";
import { authenticateToken } from "./middleware/authMiddleware.js";
import connectDB from "./config/db.js";
import path from 'path';

// Load env variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

// MongoDB connection
connectDB();

// Route mounting
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);    // /api/chat
app.use("/protected", protectedRoutes); // /api/protected
app.use("/resume", authenticateToken, resumeRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
