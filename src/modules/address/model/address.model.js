import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    label: {
      type: String,
      enum: ["Home", "Hall"],
      default: "Home",
    },
    hall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hall",
    },
    fullName: {
      type: String,
      trim: true,
    },
    addressLine: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    active: {
      type: Boolean,
      default: false,
    },
    del: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);
const AddressModel = mongoose.model("Address", addressSchema);
export default AddressModel;
