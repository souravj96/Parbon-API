import mongoose from 'mongoose';
import { toJSON } from './plugins/index.js';

const otpSchema = mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ['phone_verification', 'login', 'password_reset'],
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
      max: 3,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Add plugin that converts mongoose to json
otpSchema.plugin(toJSON);

// Static method to create OTP
otpSchema.statics.createOTP = async function (phoneNumber, otp, purpose, expiryMinutes = 10) {
  // Remove any existing unverified OTPs for this phone number and purpose
  await this.deleteMany({ 
    phoneNumber, 
    purpose, 
    isVerified: false 
  });

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + expiryMinutes);

  return this.create({
    phoneNumber,
    otp,
    purpose,
    expiresAt,
  });
};

// Static method to verify OTP
otpSchema.statics.verifyOTP = async function (phoneNumber, otp, purpose) {
  const otpDoc = await this.findOne({
    phoneNumber,
    purpose,
    isVerified: false,
    expiresAt: { $gt: new Date() },
  });

  if (!otpDoc) {
    return { success: false, message: 'Invalid or expired OTP' };
  }

  // Increment attempts
  otpDoc.attempts += 1;
  await otpDoc.save();

  // Check if max attempts reached
  if (otpDoc.attempts > 3) {
    await otpDoc.deleteOne();
    return { success: false, message: 'Maximum attempts exceeded. Please request a new OTP.' };
  }

  // Verify OTP
  if (otpDoc.otp !== otp) {
    return { success: false, message: 'Invalid OTP' };
  }

  // Mark as verified
  otpDoc.isVerified = true;
  await otpDoc.save();

  return { success: true, message: 'OTP verified successfully', otpDoc };
};

/**
 * @typedef OTP
 */
const OTP = mongoose.model('OTP', otpSchema);

export default OTP;