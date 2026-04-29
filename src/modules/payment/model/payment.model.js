import mongoose from "mongoose";

// ======================================================
// PAYMENT SCHEMA
// ======================================================

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    type: {
      type: String,
      enum: [ "advanced", "full" ],
      default: null
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    advanceAmount: {
      type: Number,
      default: 0,
    },

    remainingAmount: {
      type: Number,
      default: 0,
    },

    commissionPercentage: {
      type: Number,
      default: 10,
    },

    commissionAmount: {
      type: Number,
      default: 0,
    },

    vendorReceivedAmount: {
      type: Number,
      default: 0,
    },

    paymentMethod: {
      type: String,
      enum: [
        "cash",
        "easypaisa",
        "jazzcash",
      ],
    },

    transactionId: {
      type: String,
      default: null,
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "refunded",
      ],
      default: "pending",
    },

    paidAt: {
      type: Date,
      default: null,
    },

    del: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const PaymentModel = mongoose.model(
  "Payment",
  paymentSchema
);