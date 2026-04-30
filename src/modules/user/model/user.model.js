import mongoose from "mongoose";
const { Schema } = mongoose;

const profileSchema = new Schema(
  {
    currencyCode: {
      type: String,
      uppercase: true,
      enum: ["USD", "PKR", "EUR", "GBP", "BHD"],
    },
    country: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    // firstName: {
    //   type: String,
    //   trim: true,
    //   minlength: 2,
    //   maxlength: 30,
    // },

    // lastName: {
    //   type: String,
    //   trim: true,
    //   minlength: 2,
    //   maxlength: 30,
    // },

    profile: profileSchema,

    class: {
      type: String,
      enum: ["user", "vendor", "admin"],
      default: "user",
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    email: {
      type: String,
      index: true,
    },

    phone: {
      countryCode: { type: String },
      phoneNumber: { type: String },
    },

    otp: {
      type: Number,
    },
    otpExpiresAt: {
      type: Date,
    },

    rating: {
      type: Schema.Types.ObjectId,
      ref: "Rating",
    },

    lastLogin: {
      type: Date,
    },

    card: {
      type: Schema.Types.ObjectId,
      ref: "Card",
    },

    address: {
      type: Schema.Types.ObjectId,
      ref: "Address",
    },

    isFirstLogin: {
      type: Boolean,
      default: true,
    },

    deviceId: {
      type: Schema.Types.ObjectId,
      ref: "Device",
    },

    ip: {
      type: String,
    },

    del: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
    },

    loginCount: {
      type: Number,
      default: 0,
    },

    deleted_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

export const UserModel = mongoose.model("User", userSchema);
