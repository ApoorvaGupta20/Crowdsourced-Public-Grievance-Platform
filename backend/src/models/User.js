import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    unique: true,
    sparse: true,
  },

  name: {
    type: String,
  },

  username: {
    type: String,
    unique: true,
    sparse: true,
  },

  email: {
    type: String,
  },

  gender: {
    type: String,
  },

  bio: {
    type: String,
  },

  avatar: {
    type: String,
  },

  otp: String,
  otpExpires: Date,

}, { timestamps: true });
export default mongoose.model("User", userSchema);