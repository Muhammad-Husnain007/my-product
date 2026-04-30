


// ======================================================
// CREATE NEGOTIATION
// ======================================================

import { HallModel } from "../../hallUpload/model/hall.model.js";
import NegotiateModel from "../model/negotiate.model.js";

export const createNegotiation = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      hall,
      receiver,
      percentage,
    } = req.body;

    // hall check
    const hallExist = await HallModel.findOne({
      _id: hall,
      del: false,
    }).select("owner pricePerSlot").lean();

    if (!hallExist) {
      return res.status(404).json({
        success: false,
        message: "Hall not found",
      });
    }

    if(hallExist.owner.toString() !== receiver) {
      return res.status(400).json({
        success: false,
        message: "Receiver must be the owner of the hall",
      });
    }
    
    const totalAmount = hallExist.pricePerSlot * (percentage / 100);

    const negotiation = await NegotiateModel.create({
      hall,
      sender: userId,
      receiver,
      percentage,
      amount: totalAmount,
    });

    return res.status(201).json({
      success: true,
      data: negotiation,
      message: "Negotiation sent successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};











