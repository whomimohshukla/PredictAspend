import { Schema, model, Document, Types } from "mongoose";
import { Category } from "./_common";

export interface IBudget extends Document {
	userId: Types.ObjectId;
	category?: Category; // null ⇒ overall budget
	limit: number;
	period: "monthly" | "weekly";
	alertsEnabled: boolean;
}

const BudgetSchema = new Schema<IBudget>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		category: { type: String, enum: Object.values(Category) },
		limit: { type: Number, required: true, min: 0 },
		period: { type: String, enum: ["monthly", "weekly"], default: "monthly" },
		alertsEnabled: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

// avoid duplicate budgets per category & period
BudgetSchema.index({ userId: 1, category: 1, period: 1 }, { unique: true });

export default model<IBudget>("Budget", BudgetSchema);
