import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Import User Model

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password"); // Attach user info to request

        if (!req.user) {
            return res.status(401).json({ message: "User not found, authorization denied" });
        }

        next(); // Proceed to the next middleware/controller
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

export default authMiddleware;
