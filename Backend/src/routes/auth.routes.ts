import { Router } from "express";
import { requestOtp, verifyOtpCode, registerUser } from "../controllers/auth.controller";

const router = Router();

// Public endpoints
router.post("/request-otp", requestOtp);     // body: { email? phone? }
router.post("/verify-otp", verifyOtpCode);   // body: { email? phone?, code, name?, password? }
router.post("/register", registerUser);      // optional email/password signup after OTP

export default router;
