import { Router } from "express";
import { register, login, getMe, updateProfile } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/me  (protected)
router.get("/me", authMiddleware, getMe);

// PUT /api/auth/profile (protected)
router.put("/profile", authMiddleware, updateProfile);

export default router;
