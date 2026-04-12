import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    type: {
        type: String,
        enum: ["id_card"],
    },
    imageFrontSide: {
        type: String,
    },
    imageBackSide: {
        type: String,
    },

    issueDate: {
        type: Date,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    del: {
        type: Boolean,
        default: false
    },
     deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const DocumentModel = mongoose.model("Document", documentSchema);
export default DocumentModel;