import DocumentModel from "../model/document.model.js";

export const getDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const doc = await DocumentModel.findOne({
      _id: documentId,
      del: false,
    }).populate("user", "name email");

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
