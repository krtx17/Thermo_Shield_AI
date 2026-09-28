import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/login", authRateLimiter, AuthController.login);
router.post("/register", authRateLimiter, AuthController.register);
router.get("/me", requireAuth, AuthController.getProfile);

export default router;
