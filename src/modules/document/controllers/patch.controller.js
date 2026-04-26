import DocumentModel from "../model/document.model.js";

export const updateDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const updatedDoc = await DocumentModel.findOneAndUpdate(
      {_id: documentId, del: false},
      { $set: req.body },
      { new: true }
    ).select("-_v -deletedAt");

    if (!updatedDoc) {
      return res.status(404).json({
        success: false,
        message: "Document not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Document updated successfully",
      data: updatedDoc
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};