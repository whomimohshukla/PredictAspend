import { Schema, model, Document, Types } from "mongoose";
import { Category } from "./_common";

export interface IForecast extends Document {
	userId: Types.ObjectId;
	periodStart: Date;
	periodEnd: Date;
	category?: Category; // null ⇒ total forecast
	predictedTotal: number;
	modelVersion: string;
	generatedAt: Date;
}

const ForecastSchema = new Schema<IForecast>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		periodStart: { type: Date, required: true },
		periodEnd: { type: Date, required: true },
		category: { type: String, enum: Object.values(Category) },
		predictedTotal: { type: Number, required: true },
		modelVersion: { type: String, default: "v1" },
		generatedAt: { type: Date, default: Date.now },
	},
	{ timestamps: false }
);

ForecastSchema.index(
	{ userId: 1, periodStart: 1, category: 1 },
	{ unique: true }
);

export default model<IForecast>("Forecast", ForecastSchema);
