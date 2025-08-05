import { Schema, model, Document, Types } from "mongoose";
import { Category, Frequency, PaymentMethod } from "./_common";

export interface IExpense extends Document {
	userId: Types.ObjectId;
	amount: number;
	category: Category;
	date: Date;
	notes?: string;
	merchant?: string;
	paymentMethod?: PaymentMethod;
	recurring?: {
		isRecurring: boolean;
		frequency: Frequency;
		nextOccurrence?: Date;
	};
	createdAt: Date;
	updatedAt: Date;
}

const RecurringSub = new Schema(
	{
		isRecurring: { type: Boolean, default: false },
		frequency: { type: String, enum: Object.values(Frequency) },
		nextOccurrence: { type: Date },
	},
	{ _id: false }
);

const ExpenseSchema = new Schema<IExpense>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		amount: { type: Number, required: true, min: 0 },
		category: { type: String, enum: Object.values(Category), required: true },
		date: { type: Date, default: Date.now },
		notes: { type: String, maxlength: 280 },
		merchant: { type: String },
		paymentMethod: { type: String, enum: Object.values(PaymentMethod) },
		recurring: RecurringSub,
	},
	{ timestamps: true }
);

// index to speed up date-range queries per user
ExpenseSchema.index({ userId: 1, date: -1 });

export default model<IExpense>("Expense", ExpenseSchema);
