import { Schema, model, Document } from "mongoose";
export type UserRole = "user" | "admin";

export interface IUser extends Document {
	email?: string; // optional – still unique if present
	passwordHash?: string; // only used for email/password auth
	phone?: string; // optional – E.164, unique
	name: string;
	role: UserRole;
	isVerified: boolean;
	disabled: boolean;

	// one-time-password support
	emailOtpHash?: string;
	phoneOtpHash?: string;
	otpExpires?: Date;

	settings: {
		currency: string;
		darkMode: boolean;
		locale: string;
	};

	createdAt: Date;
}

const UserSchema = new Schema<IUser>(
	{
		email: {
			type: String,
			lowercase: true,
			unique: true,
			sparse: true, // allows null + unique
		},
		passwordHash: String, // required only if you keep pwd login

		phone: {
			type: String,
			unique: true,
			sparse: true,
		},

		name: { type: String, required: true },
		role: { type: String, enum: ["user", "admin"], default: "user" },

		emailOtpHash: String,
		phoneOtpHash: String,
		otpExpires: Date,

		isVerified: { type: Boolean, default: false },
		disabled: { type: Boolean, default: false },

		settings: {
			currency: { type: String, default: "USD" },
			darkMode: { type: Boolean, default: false },
			locale: { type: String, default: "en-US" },
		},
	},
	{ timestamps: { createdAt: true, updatedAt: false } }
);

// indexes for faster lookup
UserSchema.index({ phone: 1 });
UserSchema.index({ email: 1 });

// Guard: ensure at least one credential exists
UserSchema.pre("save", function (next) {
	// @ts-ignore
	if (!this.email && !this.phone) {
		return next(new Error("User must have at least an email or phone"));
	}
	next();
});

export default model<IUser>("User", UserSchema);
