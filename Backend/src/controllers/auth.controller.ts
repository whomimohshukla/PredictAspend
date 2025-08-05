import OTPModel from "../models/otpModel";
import UserModel from "../models/User";
import bcrypt from "bcrypt";




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
		// Check if user already exists
		const existingUser = await UserModel.findOne({
			$or: [{ email }, { phone }],
		});

		if (existingUser) {
			return res.status(409).json({ message: "User already exists." });
		}

		// Optional OTP verification (if implemented)
		const contact = email || phone;
		const otpRecord = await OTPModel.findOne({ contact });

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

		await OTPModel.deleteOne({ contact });

		res.status(201).json({
			message: "User created successfully.",
			user: userCreated,
		});
	} catch (error) {
		console.error("Register error:", error);
		return res.status(500).json({ message: "Internal server error." });
	}
};
