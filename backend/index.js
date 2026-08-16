import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.route.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/" , (req, res) => {
    res.send("E-commerce API is running");
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});