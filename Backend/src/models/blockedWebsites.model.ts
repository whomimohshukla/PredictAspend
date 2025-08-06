import mongoose, { Document, Schema } from "mongoose";

export interface IBlockedWebsite extends Document {
	user: mongoose.Types.ObjectId;
	urlPattern: string;
	reason?: string;
}

const BlockedWebsiteSchema = new Schema<IBlockedWebsite>(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		urlPattern: { type: String, required: true },
		reason: { type: String },
	},
	{ timestamps: true }
);

export default mongoose.model<IBlockedWebsite>(
	"BlockedWebsite",
	BlockedWebsiteSchema
);
