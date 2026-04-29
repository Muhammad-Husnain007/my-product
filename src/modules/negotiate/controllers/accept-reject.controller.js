// ======================================================
// ACCEPT / REJECT NEGOTIATION
// ======================================================

import NegotiateModel from "../model/negotiate.model.js";

export const updateNegotiationStatus = async (req, res) => {
  try {

    const { id } = req.params;

    const userId = req.user._id;

    const { status } = req.body;


    const negotiation = await NegotiateModel.findOneAndUpdate(
      {
        _id: id,
        receiver: userId,
        status: "send",
        del: false,
      },
      {
        $set: {
          status,
        },
      },
      {
        new: true,
      }
    );

    if (!negotiation) {
      return res.status(404).json({
        success: false,
        message: "Negotiation not found or already processed",
      });
    }

    return res.status(200).json({
      success: true,
      data: negotiation,
      message: `Negotiation ${status} successfully`,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};