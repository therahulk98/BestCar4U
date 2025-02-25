import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.js";
import favoriteRouter from "./routes/favorites.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// ✅ Fix CORS to allow frontend requests
app.use(cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// ✅ Use Routes
app.use("/api/auth", authRouter);
app.use("/api/favorites", favoriteRouter);

app.get("/", (req, res) => res.send("Backend is working!!"));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
