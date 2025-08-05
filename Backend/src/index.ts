import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/database";
import authRoutes from "./routes/auth.routes";

const app = express();

console.log("Server is running on port 3000");

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
	helmet({
		contentSecurityPolicy: false, // disable CSP if needed
		crossOriginEmbedderPolicy: false, // turn off specific headers
	})
);
connectDB();

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});
