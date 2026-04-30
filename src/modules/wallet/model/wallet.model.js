import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    balance: {
      type: Number,
      default: 0,
    },

    totalEarning: {
      type: Number,
      default: 0,
    },

    totalDebit: {
      type: Number,
      default: 0,
    },

    totalCredit: {
      type: Number,
      default: 0,
    },

    totalCommissionPaid: {
      type: Number,
      default: 0,
    },

    active: {
        type: Boolean,
        default: true,
        index: true,

    },

    currencyCode: {
      type: String,
      uppercase: true,
      enum: ["USD", "PKR", "EUR", "GBP", "BHD"],
      default: "USD",
    },

    del: {
      type: Boolean,
      default: false,
      index: true
    },
  },
  {
    timestamps: true,
  }
);

export const WalletModel = mongoose.model(
  "Wallet",
  walletSchema
);