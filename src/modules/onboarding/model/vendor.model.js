import mongoose, { mongo } from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
     type: String,
     enum: ["accepted", "rejected"]
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifiedAt: {
      type: Date,
      default: null,
    },
    del: {
      type: Boolean,
      default: false,
    },
     deletedAt: {
      type: Date,
    },
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Documents",
    },
    otp: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },
    // more fields to be added
  },
  { timestamps: true },
);

const VendorModel = mongoose.model("VendorOnboarding", vendorSchema);
export default VendorModel;
