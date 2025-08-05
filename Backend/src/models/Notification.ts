import { Schema, model, Document, Types } from "mongoose";

export interface INotification extends Document {
	userId: Types.ObjectId;
	title: string;
	message: string;
	read: boolean;
	type: "budget" | "anomaly" | "reminder" | "system";
	createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		title: { type: String, required: true },
		message: { type: String, required: true },
		type: {
			type: String,
			enum: ["budget", "anomaly", "reminder", "system"],
			default: "system",
		},
		read: { type: Boolean, default: false },
	},
	{ timestamps: { createdAt: true, updatedAt: false } }
);

export default model<INotification>("Notification", NotificationSchema);
