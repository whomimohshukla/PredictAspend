import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
	try {
		const MONGO_URI = process.env.MONGO_URI || "";
		if (!MONGO_URI) throw new Error("MONGO_URI not defined in .env");

		await mongoose.connect(MONGO_URI);
		console.log("MongoDB connected");
	} catch (error) {
		console.error(" MongoDB connection error:", error);
		process.exit(1);
	}
};

export default connectDB;
