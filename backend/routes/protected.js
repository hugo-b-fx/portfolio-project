// routes/protected.js
import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, (req, res) => {
  res.json({ message: `Hello user ${req.user.userId}, you are authenticated!` });
});

export default router;