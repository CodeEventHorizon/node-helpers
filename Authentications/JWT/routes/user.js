import express from "express";

const router = express.Router();

// middleware
import { requireAuth, loginLimiter } from "../middlewares/index.js";

// controllers
import { register, login, verifyToken } from "../controllers/user.js";

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.post("/verifyToken", requireAuth, verifyToken);

export default router;
