import { Schema, model, Document } from "mongoose";
export type UserRole = "user" | "admin";

export interface IUser extends Document {
	email?: string;
	passwordHash?: string;
	phone?: string; 
	name: string;
	role?: UserRole;
	isVerified: boolean;
	disabled: boolean;

	
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
			sparse: true, 
		},
		passwordHash: { type: String, select: false }, 

		phone: {
			type: String,
			unique: true,
			sparse: true,
			validate: {
				validator: (v: string) => /^\+?[1-9]\d{1,14}$/.test(v), 
				message: "Phone number must be in E.164 format",
			},
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


UserSchema.index({ phone: 1 });
UserSchema.index({ email: 1 });

UserSchema.pre("save", function (next) {
	
	if (!this.email && !this.phone) {
		return next(
			new Error("User must have either an email or a phone number")
		);
	}
	next();
});

export default model<IUser>("User", UserSchema);
