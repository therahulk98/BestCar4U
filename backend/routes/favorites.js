import express from "express";
import Favorite from "../models/Favorite.js";
import authMiddleware from "../middlewares/authMiddleware.js"; // ✅ Import Correct Middleware

const router = express.Router();

// ✅ Add a Car to Favourites
router.post("/add", authMiddleware, async (req, res) => {
    console.log("✅ User ID:", req.user); // Should be `{ id: "someUserId" }`
    console.log("✅ Received Request Body:", req.body); // Should be `{ car: { make, model, price } }`

    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { car } = req.body;
    if (!car || !car.model || !car.make || !car.price) {
        console.log("❌ Invalid car data received:", car);
        return res.status(400).json({ message: "Invalid car data" });
    }

    try {
        const userId = req.user.id;

        const existingFavorite = await Favorite.findOne({ userId, "car.model": car.model });
        if (existingFavorite) {
            return res.status(400).json({ message: "Car already in favorites" });
        }

        const newFavorite = new Favorite({ userId, car });
        await newFavorite.save();

        res.status(201).json({ message: "Added to favorites!" });
    } catch (error) {
        console.error("🔥 Error adding favorite:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Remove a Car from Favorites
router.delete("/remove", authMiddleware, async (req, res) => {
    try {
        const { model } = req.body;
        const userId = req.user.id;

        await Favorite.findOneAndDelete({ userId, "car.model": model });

        res.json({ message: "Removed from favorites!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Get All Favorite Cars for a User
router.get("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const favorites = await Favorite.find({ userId });

        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

export default router;
