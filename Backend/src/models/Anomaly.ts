import { Schema, model, Document, Types } from "mongoose";
import { Category } from "./_common";

export interface IAnomaly extends Document {
	userId: Types.ObjectId;
	category: Category;
	amount: number;
	threshold: number;
	periodStart: Date;
	periodEnd: Date;
	resolved: boolean;
}

const AnomalySchema = new Schema<IAnomaly>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		category: { type: String, enum: Object.values(Category), required: true },
		amount: { type: Number, required: true },
		threshold: { type: Number, required: true },
		periodStart: Date,
		periodEnd: Date,
		resolved: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

export default model<IAnomaly>("Anomaly", AnomalySchema);
