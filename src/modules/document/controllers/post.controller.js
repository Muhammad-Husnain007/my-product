import DocumentModel from "../model/document.model.js";

export const createDocument = async (req, res) => {
  try {
    const user = req.user._id; 
    const {
      type,
      imageFrontSide,
      imageBackSide,
      issueDate,
      expiryDate
    } = req.body;

    const doc = await DocumentModel.create({
      user,
      type,
      imageFrontSide,
      imageBackSide,
      issueDate,
      expiryDate
    });

    return res.status(201).json({
      success: true,
      message: "Document created successfully",
      data: doc
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};