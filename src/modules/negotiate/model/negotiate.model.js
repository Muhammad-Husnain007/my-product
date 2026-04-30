import mongoose from "mongoose";

const negotiateSchema = new mongoose.Schema(
  {
      hall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Halls",
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    percentage: {
      type: Number,
      enum: [5, 10, 15],
      default: null
    },

    amount: {
      type: Number,
      default: null
    },

    status: {
      type: String,
      enum: ["send", "accepted", "rejected", "cancelled"],
      default: "send",
    },

    del: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const NegotiateModel = mongoose.model("Negotiate", negotiateSchema);

export default NegotiateModel;