import mongoose from "mongoose";
import User from "./user.model.js";

const resetOtpSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
      index: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

// Automatically delete document when expiresAt is reached
resetOtpSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);


const PasswordResetOTP = mongoose.model(
  "PasswordResetOTP",
  resetOtpSchema
);

export default PasswordResetOTP;