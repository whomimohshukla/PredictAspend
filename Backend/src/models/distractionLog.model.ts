import mongoose, { Document, Schema } from "mongoose";

export interface IDistractionLog extends Document {
	user: mongoose.Types.ObjectId;
	session: mongoose.Types.ObjectId;
	eventTime: Date;
	reason?: string;
	activeTabURL?: string;
}

const DistractionLogSchema = new Schema<IDistractionLog>(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		session: {
			type: Schema.Types.ObjectId,
			ref: "FocusSession",
			required: true,
		},
		eventTime: { type: Date, default: Date.now },
		reason: { type: String },
		activeTabURL: { type: String },
	},
	{ timestamps: true }
);

export default mongoose.model<IDistractionLog>(
	"DistractionLog",
	DistractionLogSchema
);
