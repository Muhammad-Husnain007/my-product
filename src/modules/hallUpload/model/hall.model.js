import mongoose from "mongoose";

const hallSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",   
    },
    hallName: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },

    pricePerSlot: {
      type: Number,
    },

    capacity: {
      type: Number,
    },

    amenities: [
      {
        type: String,
      },
    ],

    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],

    isAvailable: {
      type: Boolean,
      default: true,
    },
    del: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const HallModel = mongoose.model("Hall", hallSchema);