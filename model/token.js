import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required:true
    },
     createdAt: {
        type: Date,
        default: Date.now,
        expires: "7d" // Token will automatically expire after 7 days
    }
})

const token = mongoose.model('token', tokenSchema)
export default token;