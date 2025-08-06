import mongoose, { Document, Schema } from "mongoose";

export interface IDailyStat extends Document {
	user: mongoose.Types.ObjectId;
	date: string;
	totalFocusMinutes: number;
	totalDistractions: number;
	sessionsCompleted: number;
	streakContinued: boolean;
}

const DailyStatSchema = new Schema<IDailyStat>(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		date: { type: String, required: true },
		totalFocusMinutes: { type: Number, default: 0 },
		totalDistractions: { type: Number, default: 0 },
		sessionsCompleted: { type: Number, default: 0 },
		streakContinued: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

export default mongoose.model<IDailyStat>("DailyStat", DailyStatSchema);
