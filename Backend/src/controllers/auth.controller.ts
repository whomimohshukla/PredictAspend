import OTPModel from "../models/otpModel";
import UserModel from "../models/User";
import bcrypt from "bcryptjs";

import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { asyncHandler } from "../utils/handler";
import { generateAndStoreOtp, verifyOtp } from "../services/otp.service";
import { sendSms, sendEmail } from "../services/notify.service";

const sign = (id: string) =>
	jwt.sign({ sub: id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

export const requestOtp = asyncHandler(async (req: Request, res: Response) => {
	const { email, phone } = req.body;
	if (!email && !phone)
		return res.status(400).json({ message: "email or phone required" });
	if (email && phone)
		return res.status(400).json({ message: "choose ONE contact method" });

	const contact = email || phone;
	const mode: "email" | "phone" = email ? "email" : "phone";

	const code = await generateAndStoreOtp(contact!, mode);

	// deliver
	if (mode === "phone") await sendSms(contact!, code);
	else await sendEmail(contact!, code);

	res.status(200).end(); // always 200 to prevent enumeration
});

export const verifyOtpCode = asyncHandler(async (req, res) => {
	const { email, phone, code, name, password } = req.body;
	const contact = email || phone;
	const mode: "email" | "phone" = email ? "email" : "phone";
	if (!contact || !code)
		return res.status(400).json({ message: "contact & code required" });

	const ok = await verifyOtp(contact, code, mode);
	if (!ok) return res.status(401).json({ message: "invalid or expired code" });

	// upsert user
	const user = await UserModel.findOneAndUpdate(
		mode === "email" ? { email } : { phone },
		{
			name,
			// set password ONLY if provided (email flow)
			...(password ? { passwordHash: await bcrypt.hash(password, 10) } : {}),
			isVerified: true,
		},
		{ new: true, upsert: true, setDefaultsOnInsert: true }
	);

	res.json({ token: sign(user.id), user });
});

export const registerUser = async (req: any, res: any) => {
	try {
		const { email, phone, name, password } = req.body;

		// Validate required fields
		if (!name || !password || (!email && !phone)) {
			return res.status(400).json({
				message:
					"Name, password, and either email or phone number are required.",
			});
		}

		// Allow only one: email OR phone
		if (email && phone) {
			return res.status(400).json({
				message: "Provide either email or phone number, not both.",
			});
		}
		// Check if user already exists (may have been auto-created during OTP verification)
		const existingUser = await UserModel.findOne({
			$or: [{ email }, { phone }],
		});

		if (existingUser) {
			// If the user already has a password set, prevent duplicate sign-ups
			if (existingUser.passwordHash) {
				return res.status(409).json({ message: "User already exists." });
			}

			// Otherwise, attach password and return success
			existingUser.name = name;
			existingUser.passwordHash = await bcrypt.hash(password, 10);
			existingUser.isVerified = true;
			await existingUser.save();

			return res.status(200).json({
				message: "Password set successfully.",
				user: existingUser,
			});
		}

		// Optional OTP verification (if implemented)
		const contact = email || phone;
		const otpRecord = await OTPModel.findOne(email ? { email } : { phone });

		if (!otpRecord) {
			return res
				.status(400)
				.json({ message: "OTP not verified. Please verify OTP first." });
		}

		// Hash password
		const passwordHash = await bcrypt.hash(password, 10);

		const userCreated = await UserModel.create({
			email,
			phone,
			name,
			passwordHash,
			isVerified: true,
		});

		await OTPModel.deleteOne(email ? { email } : { phone });

		res.status(201).json({
			message: "User created successfully.",
			user: userCreated,
		});
	} catch (error) {
		console.error("Register error:", error);
		return res.status(500).json({ message: "Internal server error." });
	}
};
