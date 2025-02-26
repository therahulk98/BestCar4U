import mongoose from "mongoose";



const userSchema = mongoose.Schema({
    name: {type:String, required: true },
    email: {type:String, required: true },
    password: {type:String, required: true },
}, {timestamps:true}); //adds createdAt & updatedAt

export default mongoose.model("User", userSchema);