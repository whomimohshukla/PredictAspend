/**
 * Shared enums and helpers for PredictaSpend models.
 * Extend or modify the lists to fit your domain.
 */

export enum Category {
	Food = "Food",
	Rent = "Rent",
	Transport = "Transport",
	Utilities = "Utilities",
	Shopping = "Shopping",
	Entertainment = "Entertainment",
	Healthcare = "Healthcare",
	Education = "Education",
	Insurance = "Insurance",
	Savings = "Savings",
	Other = "Other",
}

export enum Frequency {
	Daily = "daily",
	Weekly = "weekly",
	Monthly = "monthly",
	Yearly = "yearly",
}

// how the expense was paid
export enum PaymentMethod {
	Cash = "cash",
	Card = "card",
	UPI = "upi",
	BankTransfer = "bank_transfer",
	Other = "other",
}
