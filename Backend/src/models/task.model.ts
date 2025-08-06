import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
	user: mongoose.Types.ObjectId;
	title: string;
	description?: string;
	dueDate?: Date;
	isCompleted: boolean;
	associatedSession?: mongoose.Types.ObjectId;
}

const TaskSchema = new Schema<ITask>(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		title: { type: String, required: true },
		description: { type: String },
		dueDate: { type: Date },
		isCompleted: { type: Boolean, default: false },
		associatedSession: { type: Schema.Types.ObjectId, ref: "FocusSession" },
	},
	{ timestamps: true }
);

export default mongoose.model<ITask>("Task", TaskSchema);
