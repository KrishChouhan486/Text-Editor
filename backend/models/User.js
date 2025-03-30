import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: true, sparse: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Can be null for OAuth users
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
