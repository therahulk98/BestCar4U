import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    car: {
        make: { type: String, required: true },
        model: { type: String, required: true },
        price: { type: String, required: true },
        image: { type: String }
    }
}, { timestamps: true });

export default mongoose.model("Favorite", FavoriteSchema);
