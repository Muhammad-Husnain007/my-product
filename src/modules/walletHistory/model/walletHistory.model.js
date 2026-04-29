// ======================================================
// WALLET HISTORY SCHEMA
// ======================================================

import mongoose from "mongoose";

const walletHistorySchema = new mongoose.Schema(
  {
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },

    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },

    type: {
      type: String,
      enum: [
        "credit", // paisa add
        "debit", // paisa minus
        "commission", // admin commission
        "withdraw",
      ],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    previousBalance: {
      type: Number,
      required: true,
    },

    currentBalance: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      default: "",
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

export const WalletHistoryModel = mongoose.model(
  "WalletHistory",
  walletHistorySchema
);