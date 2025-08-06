// src/models/otp.model.ts
import { Schema, model, Document } from "mongoose";

export interface IOTP extends Document {
  email?: string;
  phone?: string;
  otp: string;
  verified: boolean;
  createdAt: Date;
  // Remove the automatic expiration and handle it manually
}

const OTPSchema = new Schema<IOTP>({
  email: { type: String, required: false },
  phone: { type: String, required: false },
  otp: { type: String, required: true },
  verified: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
    // Remove expires: 300 completely
  },
});

// Add a compound index for better performance
OTPSchema.index({ email: 1, verified: 1 });
OTPSchema.index({ phone: 1, verified: 1 });
OTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 }); // This will be removed for verified OTPs

OTPSchema.pre("save", function (next) {
  if (!this.email && !this.phone) {
    return next(new Error("OTP must have either an email or a phone number"));
  }
  next();
});

export default model<IOTP>("OTP", OTPSchema);