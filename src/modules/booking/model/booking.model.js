import mongoose from "mongoose";

const { Schema, model } = mongoose;


const bookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
    },
    hall: {
      type: Schema.Types.ObjectId,
      ref: "Hall",
      required: true,
    },

    eventType: {
      type: String,
      enum: ["wedding", "birthday", "corporate", "party", "other"],
      required: true,
    },
    guestCount: {
      type: Number,
      required: true,
    },
    specialRequests: {
      type: String,
      default: null,
    },

    // ========== Time Slot ==========
    bookingDate: {
      type: Date,
      required: true,
    },
    slot: {
      startTime: { type: String, required: true }, // e.g. "14:00"
      endTime: { type: String, required: true },   // e.g. "22:00"
    },

    // ========== Status ==========
    status: {
      type: String,
      enum: ["accepted", "rejected", "cancelled", "send", "completed"],
      default: "send",
      index: true,

    },

    rejectReason: {
      type: String,
      default: null,
    },

    forComplete: {
      type: String,
      default: null,
    },

    paymentCalculation: {
        type: Number,
        default: null,
    },

    del: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

const BookingModel = model("Booking", bookingSchema);
export default BookingModel;