import mongoose, {Schema} from "mongoose";

/**
 * 🔹 Device Info Sub Schema
 */
const infoSchema = new Schema({
  os: {
    type: String,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  version: {
    type: String,
    trim: true
  },
  model: {
    type: String,
    trim: true
  }
}, { _id: false });

/**
 * 🔹 Device Schema
 */
const deviceSchema = new Schema({
  ip: {
    type: String,
    trim: true
  },

  deviceId: {
    type: String,
    required: true,
    trim: true,
    index: true
  },

  class: {
    type: String,
    enum: ["lurker", "user", "admin"]
  },

  info: infoSchema, // ✅ real object

  // user: {
  //   type: Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true
  // },

  del: {
    type: Boolean,
    default: false
  },

  deleted_at: {
    type: Date
  }
}, {
  timestamps: true 
});

export const DeviceModel = mongoose.model("Device", deviceSchema);
