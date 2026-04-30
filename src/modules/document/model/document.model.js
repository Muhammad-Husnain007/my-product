import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["id_card", "hall_images"],
    },

    imageFrontSide: {
      type: String,
    },
    imageBackSide: {
      type: String,
    },

    hallImages: {
      type: String,
    },

    issueDate: {
      type: Date,
    },
    expiryDate: {
      type: Date,
    },
    del: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
       index: true,
    },
  },
  { timestamps: true },
);

const DocumentModel = mongoose.model("Document", documentSchema);
export default DocumentModel;
