// ======================================================
// CANCEL NEGOTIATION
// ======================================================

import NegotiateModel from "../model/negotiate.model.js";

export const cancelNegotiation = async (req, res) => {
  try {

    const { id } = req.params;

    const userId = req.user._id;

    const negotiation = await NegotiateModel.findOneAndUpdate(
      {
        _id: id,
        sender: userId,
        status: "send",
        del: false,
      },
      {
        $set: {
          status: "cancelled",
        },
      },
      {
        new: true,
      }
    );

    if (!negotiation) {
      return res.status(404).json({
        success: false,
        message: "Negotiation not found or cannot be cancelled",
      });
    }

    return res.status(200).json({
      success: true,
      data: negotiation,
      message: "Negotiation cancelled successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};