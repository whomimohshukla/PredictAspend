import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
	email: string;
	password: string;
	name?: string;
	avatar?: string;
	goals: {
		dailyFocusMinutes: number;
	};
	currentStreak: number;
	longestStreak: number;
	lastLoginDate?: Date;
}

const userSchema = new Schema<IUser>(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			validate: {
				validator: (v) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v),
				message: (props) => `${props.value} is not a valid email address!`,
			},
		},

		password: {
			type: String,
			required: true,
			minlength: 8,
			trim: true,
		},

		name: { type: String },
		avatar: { type: String },
		goals: {
			dailyFocusMinutes: { type: Number, default: 60 },
		},
		currentStreak: { type: Number, default: 0 },
		longestStreak: { type: Number, default: 0 },
		lastLoginDate: { type: Date },
	},
	{
		timestamps: true,
	}
);

export default mongoose.model<IUser>("User", userSchema);
