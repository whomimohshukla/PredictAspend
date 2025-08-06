import mongoose, { Document, Schema } from "mongoose";

export interface IFocusSession extends Document {
	user: mongoose.Types.ObjectId;
	startTime: Date;
	endTime: Date;
	duration: number;
	sessionType: "Pomodoro" | "Custom" | "Deep Work";
	distractions: number;
	mood: "😄" | "😐" | "😓" | "😡";
}

const FocusSessionSchema = new Schema<IFocusSession>(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		startTime: { type: Date, required: true },
		endTime: { type: Date, required: true },
		duration: { type: Number, required: true },
		sessionType: {
			type: String,
			enum: ["Pomodoro", "Custom", "Deep Work"],
			required: true,
		},
		distractions: { type: Number, default: 0 },
		mood: { type: String, enum: ["😄", "😐", "😓", "😡"], default: "😐" },
	},
	{ timestamps: true }
);

export default mongoose.model<IFocusSession>(
	"FocusSession",
	FocusSessionSchema
);
