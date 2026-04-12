import DocumentModel from "../model/document.model.js";

export const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const deletedDoc = await DocumentModel.findByIdAndUpdate(
      documentId,
      { del: true, deletedAt: new Date() },
      { new: true }
    ).select("_id");

    if (!deletedDoc) {
      return res.status(404).json({
        success: false,
        message: "Document not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};