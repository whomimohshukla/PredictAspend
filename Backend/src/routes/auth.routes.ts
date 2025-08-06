import { Router } from "express";
import {
	requestOtp,
	verifyOtpCode,
	registerUser,
	loginUser,
	verifyAndRegister,
	getCurrentUser,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";

const router = Router();
// Public routes
router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtpCode);
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/verify-and-register", verifyAndRegister);

// Protected routes
router.get("/me", authenticate, getCurrentUser);
export default router;
