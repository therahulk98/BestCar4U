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


const allowedOrigins = [
    "http://localhost:5173",
    "https://best-car4u-frontend.vercel.app/"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true // Enable credentials (if using cookies or authorization headers)
}));


// ✅ Use Routes
app.use("/api/auth", authRouter);
app.use("/api/favorites", favoriteRouter);

app.get("/", (req, res) => res.send("Backend is working!!"));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
