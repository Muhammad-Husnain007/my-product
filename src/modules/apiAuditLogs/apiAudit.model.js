import mongoose from "mongoose";

const apiAuditLogSchema = new mongoose.Schema(
  {
    method: String,
    route: String,
    statusCode: Number,
    durationMs: Number,

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    ip: String,

    request: {
      body: Object,
      query: Object,
      params: Object,
    },

    response: Object,

    headers: Object,

    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
      expires: "200d", // auto delete after 200 days (IMPORTANT for storage)
    },
  },
  { timestamps: false }
);

export const ApiAuditModel = mongoose.model("ApiAuditLog", apiAuditLogSchema);