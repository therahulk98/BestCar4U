import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import authMiddleware from "../middlewares/authMiddleware.js";


const router = express.Router()


//SignUp Route

router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save New User
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        // ✅ Generate JWT Token
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: "3h" });

        // ✅ Return Token & User Data
        res.status(201).json({
            message: "User registered successfully!",
            token,
            user: { id: newUser.id, name: newUser.name, email: newUser.email }
        });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});


//Login Route

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("🔍 Checking email:", email);

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ User not found!");
            return res.status(400).json({ message: "User not found" });
        }

        console.log("✅ User found:", user);

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Invalid password attempt");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        console.log("✅ Password is correct, generating JWT...");

        // Generate JWT Token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "3h" });

        console.log("✅ Token Generated:", token);

        res.json({ message: "Login successful", token, user: { id: user.id, name: user.name, email: user.email } });

    } catch (error) {
        console.error("🔥 Login Error:", error);
        res.status(500).json({ error: error.message });
    }
});

router.get("/me", authMiddleware, async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



export default router;