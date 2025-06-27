import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resumes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
    },
  ],
  resetToken: { type: String },
  resetTokenExpiry: { type: Number },
});

export default mongoose.model("User", userSchema);
