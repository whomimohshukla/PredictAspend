
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/User";
import OTPModel from "../models/otpModel";
import { asyncHandler } from "../utils/handler";
import { generateAndStoreOtp, verifyOtp } from "../services/otp.service";
import { sendEmail, sendSms } from "../services/notify.service";

const signToken = (id: string) =>
  jwt.sign({ sub: id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

/**
 * POST /auth/request-otp
 * Request OTP for login/registration
 * Body: { email or phone }
 */
export const requestOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, phone } = req.body;
  
  if (!email && !phone) {
    return res.status(400).json({ message: "Email or phone is required." });
  }
  
  if (email && phone) {
    return res.status(400).json({ message: "Provide only one: email or phone." });
  }

  const contact = email || phone;
  const mode: "email" | "phone" = email ? "email" : "phone";

  try {
    const code = await generateAndStoreOtp(contact, mode);
    console.log(`Generated OTP for ${contact}:`, code);

    if (mode === "email") {
      await sendEmail(contact, code);
    } else {
      await sendSms(contact, code);
    }

    return res.status(200).json({ 
      message: "OTP sent successfully.",
      contact: mode === "email" ? email : phone 
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ message: "Failed to send OTP. Please try again." });
  }
});

/**
 * POST /auth/verify-otp
 * Verify OTP code (for two-step process)
 * Body: { email/phone, code }
 */
export const verifyOtpCode = asyncHandler(async (req: Request, res: Response) => {
  const { email, phone, code } = req.body;
  const contact = email || phone;
  const mode: "email" | "phone" = email ? "email" : "phone";

  if (!contact || !code) {
    return res.status(400).json({ message: "Contact and code are required." });
  }

  const valid = await verifyOtp(contact, code, mode);
  if (!valid) {
    return res.status(401).json({ message: "Invalid or expired OTP." });
  }

  // Create a verified OTP record that won't expire immediately
  await OTPModel.deleteOne({ [mode]: contact });
  await OTPModel.create({
    [mode]: contact,
    otp: code,
    verified: true,
    createdAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Set to tomorrow to avoid TTL
  });

  return res.status(200).json({ 
    message: "OTP verified successfully. You can now complete registration." 
  });
});

/**
 * POST /auth/login
 * Login existing user with OTP
 * Body: { email/phone, code }
 */
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, phone, code } = req.body;
  const contact = email || phone;
  const mode: "email" | "phone" = email ? "email" : "phone";

  if (!contact || !code) {
    return res.status(400).json({ message: "Contact and code are required." });
  }

  // Verify OTP
  const valid = await verifyOtp(contact, code, mode);
  if (!valid) {
    return res.status(401).json({ message: "Invalid or expired OTP." });
  }

  // Find existing user
  const user = await UserModel.findOne({ [mode]: contact });
  if (!user) {
    return res.status(404).json({ 
      message: "User not found. Please register first.",
      needsRegistration: true 
    });
  }

  if (user.disabled) {
    return res.status(403).json({ message: "Account is disabled." });
  }

  // Update user verification status
  user.isVerified = true;
  await user.save();

  // Clean up OTP
  await OTPModel.deleteOne({ [mode]: contact });

  const token = signToken(user.id);

  return res.status(200).json({
    message: "Login successful.",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      settings: user.settings,
    },
  });
});

/**
 * POST /auth/register
 * Register new user (requires verified OTP)
 * Body: { email/phone, name }
 */
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, phone, name } = req.body;

  if (!name || (!email && !phone)) {
    return res.status(400).json({ message: "Name and contact are required." });
  }

  const contact = email || phone;
  const mode: "email" | "phone" = email ? "email" : "phone";

  // Check for verified OTP
  const otpRecord = await OTPModel.findOne({
    [mode]: contact,
    verified: true,
  });

  if (!otpRecord) {
    return res.status(400).json({ message: "OTP not verified. Please verify OTP first." });
  }

  // Check if user already exists
  let user = await UserModel.findOne({ [mode]: contact });

  if (!user) {
    // Create new user
    user = await UserModel.create({
      [mode]: contact,
      name,
      isVerified: true,
    });
  } else {
    // Update existing user
    user.name = name;
    user.isVerified = true;
    await user.save();
  }

  // Clean up OTP
  await OTPModel.deleteOne({ [mode]: contact });

  const token = signToken(user.id);

  return res.status(201).json({
    message: "User registered successfully.",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      settings: user.settings,
    },
  });
});

/**
 * POST /auth/verify-and-register
 * Combined verify OTP and register in one step
 * Body: { email/phone, code, name }
 */
export const verifyAndRegister = asyncHandler(async (req: Request, res: Response) => {
  const { email, phone, code, name } = req.body;
  const contact = email || phone;
  const mode: "email" | "phone" = email ? "email" : "phone";

  if (!contact || !code || !name) {
    return res.status(400).json({ 
      message: "Contact, code, and name are required." 
    });
  }

  // Verify OTP first
  const valid = await verifyOtp(contact, code, mode);
  if (!valid) {
    return res.status(401).json({ message: "Invalid or expired OTP." });
  }

  // Proceed with registration
  let user = await UserModel.findOne({ [mode]: contact });

  if (!user) {
    user = await UserModel.create({
      [mode]: contact,
      name,
      isVerified: true,
    });
  } else {
    user.name = name;
    user.isVerified = true;
    await user.save();
  }

  // Clean up OTP
  await OTPModel.deleteOne({ [mode]: contact });

  const token = signToken(user.id);

  return res.status(201).json({
    message: "User registered successfully.",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      settings: user.settings,
    },
  });
});

/**
 * GET /auth/me
 * Get current user profile
 */
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  // Assumes you have auth middleware that sets req.user
  const userId = (req as any).user?.id;
  
  if (!userId) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  return res.status(200).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      settings: user.settings,
      createdAt: user.createdAt,
    },
  });
});

// ================================================================
// src/middleware/auth.middleware.ts







