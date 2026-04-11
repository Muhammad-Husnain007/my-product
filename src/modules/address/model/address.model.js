import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    label: {
      type: String, // "Home", "Work", "Other"
      default: 'Home',
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    addressLine: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
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
  },
  { timestamps: true }
);
const AddressModel = mongoose.model('Address', addressSchema);
export default AddressModel;