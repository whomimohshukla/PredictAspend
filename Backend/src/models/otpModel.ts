// src/models/otp.model.ts
import { Schema, model, Document } from "mongoose";

// 1. Define a TypeScript interface for the document
export interface IOTP extends Document {
	email?: string; // Optional: user may verify via email or phone
	phone?: string; // Optional: used for phone verification
	otp: string;
	createdAt: Date;
}

// 2. Define the schema with types
const OTPSchema = new Schema<IOTP>({
	email: {
		type: String,
		required: false,
	},
	phone: {
		type: String,
		required: false,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 300, // 5 minutes
	},
});

// 3. Add validation to ensure at least email or phone is provided
OTPSchema.pre("save", function (next) {
	if (!this.email && !this.phone) {
		return next(new Error("OTP must have either an email or a phone number"));
	}
	next();
});

export default model<IOTP>("OTP", OTPSchema);
