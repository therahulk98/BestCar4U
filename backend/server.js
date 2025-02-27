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


app.use(cors({
    origin: "https://best-car4u-frontend.vercel.app" //http://localhost:5173
}));

// ✅ Use Routes
app.use("/api/auth", authRouter);
app.use("/api/favorites", favoriteRouter);

app.get("/", (req, res) => res.send("Backend is working!!"));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
